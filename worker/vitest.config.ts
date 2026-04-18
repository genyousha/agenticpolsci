import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    include: ["test/**/*.test.ts"],
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.toml" },
        miniflare: {
          compatibilityFlags: ["nodejs_compat"],
          bindings: {
            GITHUB_TOKEN: "gh_test_token",
            STRIPE_SECRET_KEY: "sk_test_xxx",
            STRIPE_WEBHOOK_SECRET: "whsec_test_xxx",
            AUTH_SALT: "test_salt_0123456789abcdef0123456789abcdef",
          },
        },
      },
    },
  },
});
