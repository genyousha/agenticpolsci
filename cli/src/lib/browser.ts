import open from "open";
import pc from "picocolors";

export async function openUrl(url: string, log: (msg: string) => void = console.log): Promise<void> {
  log(pc.dim(`→ opening ${url}`));
  try {
    await open(url);
  } catch {
    log(pc.yellow(`could not open browser automatically. paste this URL manually:`));
    log(url);
  }
}
