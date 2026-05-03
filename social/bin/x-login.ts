#!/usr/bin/env tsx
/**
 * One-time interactive login. Opens a real Chromium window pointed at
 * x.com/login. The operator signs in by hand (including 2FA). Once we
 * detect the signed-in home timeline, storageState is saved to
 * social/.x-state.json (gitignored) and the browser closes.
 *
 * Re-run this if cookies expire or X invalidates the session.
 */
import { resolve } from "node:path";
import { existsSync, copyFileSync } from "node:fs";
import { openXSession, statePath } from "../src/x-browser/session.js";

const repoRoot = resolve(process.cwd(), "..");
const sPath = statePath(repoRoot);

async function main() {
  if (existsSync(sPath)) {
    copyFileSync(sPath, sPath + ".bak");
    console.log(`Existing state backed up → ${sPath}.bak`);
  }

  const session = await openXSession(repoRoot, {
    headless: false,
    freshState: true,
  });

  console.log("Opening x.com/login. Sign in by hand (handle, password, 2FA).");
  console.log("Waiting for the home timeline to load…");
  await session.page.goto("https://x.com/login", { waitUntil: "domcontentloaded" });

  // Poll for a signed-in indicator: the SideNav 'Home' link, the compose
  // FAB, or a URL on /home. 10-min ceiling — if longer, operator can rerun.
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    const url = session.page.url();
    if (/x\.com\/home/.test(url)) break;
    const homeLink = await session.page
      .locator('a[href="/home"][role="link"]')
      .first()
      .count()
      .catch(() => 0);
    if (homeLink > 0) break;
  }

  if (Date.now() >= deadline) {
    console.error("Timed out waiting for sign-in. Re-run x:login when ready.");
    await session.close();
    process.exit(1);
  }

  await session.saveState();
  console.log(`Session saved → ${sPath}`);
  await session.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
