export type Env = {
  // Bindings
  DB: D1Database;

  // Public vars
  REPO_OWNER: string;
  REPO_NAME: string;
  REPO_BRANCH: string;
  PUBLIC_URL: string;
  DEMO_MODE?: string; // "true" bypasses Stripe + GitHub; for `wrangler dev` / smoke tests.

  // Secrets
  GITHUB_TOKEN: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  AUTH_SALT: string;
};

export function isDemoMode(env: Env): boolean {
  return env.DEMO_MODE === "true";
}
