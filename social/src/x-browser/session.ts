import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";

const STATE_RELATIVE_PATH = "social/.x-state.json";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/127.0.0.0 Safari/537.36";

export function statePath(repoRoot: string): string {
  return join(repoRoot, STATE_RELATIVE_PATH);
}

export type LaunchOptions = {
  /** false = visible window (use for x:login). true = headless. */
  headless?: boolean;
  /** When true, start with no persisted state (used by x:login). */
  freshState?: boolean;
};

export type Session = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  /** Persist current cookies/localStorage back to disk. */
  saveState: () => Promise<void>;
  close: () => Promise<void>;
};

export async function openXSession(
  repoRoot: string,
  opts: LaunchOptions = {},
): Promise<Session> {
  const headless = opts.headless ?? false;
  const sPath = statePath(repoRoot);
  const useStored = !opts.freshState && existsSync(sPath);

  // X_BROWSER_PATH lets the operator point at Brave / system Chrome / Edge
  // to dodge Google's "this browser may not be secure" block on the
  // bundled Chromium. Stripping --enable-automation and the
  // AutomationControlled flag also helps.
  const executablePath = process.env.X_BROWSER_PATH || undefined;
  const browser = await chromium.launch({
    headless,
    executablePath,
    args: ["--disable-blink-features=AutomationControlled"],
    ignoreDefaultArgs: ["--enable-automation"],
  });
  const context = await browser.newContext({
    storageState: useStored ? sPath : undefined,
    userAgent: DEFAULT_USER_AGENT,
    viewport: { width: 1280, height: 900 },
    locale: "en-US",
  });
  const page = await context.newPage();

  return {
    browser,
    context,
    page,
    saveState: async () => {
      await context.storageState({ path: sPath });
    },
    close: async () => {
      await context.close();
      await browser.close();
    },
  };
}

/**
 * Returns true if the current page shows a captcha challenge, login wall,
 * or 2FA/verification interstitial. Caller should bail when true.
 */
export async function detectBlockingChallenge(
  page: Page,
): Promise<{ blocked: true; reason: string } | { blocked: false }> {
  const url = page.url();
  if (/\/(login|i\/flow\/login|account\/access)/.test(url)) {
    return { blocked: true, reason: `redirected to login: ${url}` };
  }

  // Arkose / FunCaptcha iframe — X's bot challenge.
  const captchaFrame = await page
    .locator('iframe[title*="arkose" i], iframe[src*="arkoselabs" i], iframe[title*="captcha" i]')
    .first()
    .count()
    .catch(() => 0);
  if (captchaFrame > 0) return { blocked: true, reason: "captcha challenge" };

  const bodyText = (await page.locator("body").innerText().catch(() => "")) || "";
  const blockers = [
    "Verify your identity",
    "Confirm your identity",
    "Help us keep your account safe",
    "Suspicious login",
    "Enter your phone number or email",
  ];
  for (const b of blockers) {
    if (bodyText.includes(b)) return { blocked: true, reason: `interstitial: "${b}"` };
  }

  return { blocked: false };
}

/** Sleep with jitter — uniform random in [minMs, maxMs]. */
export function jitterSleep(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.floor(minMs + Math.random() * Math.max(0, maxMs - minMs));
  return new Promise((r) => setTimeout(r, ms));
}
