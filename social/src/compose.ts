import { MAX_HASHTAGS, MAX_TWEET_LEN } from "./constants.js";

export function topicToHashtag(slug: string): string {
  const camel = slug
    .split("-")
    .map((w) => (w.length === 0 ? "" : w[0]!.toUpperCase() + w.slice(1)))
    .join("");
  return `#${camel}`;
}

export type ComposeMainArgs = {
  variant: string;
  title: string;
  topics: string[];
};

// The main tweet carries the variant text + (optionally) the paper title +
// (optionally) up to MAX_HASHTAGS hashtags. NO URL — the URL goes in a
// self-reply via composeReplyBody. Per social/STRATEGY.md (rule A-4),
// external links in the main tweet zero out median engagement on
// free-tier accounts; the link-in-self-reply pattern recovers reach.
export function composeMainTweet(args: ComposeMainArgs): string {
  const hashtags = args.topics
    .slice(0, MAX_HASHTAGS)
    .map(topicToHashtag)
    .join(" ");

  // Try, in order:
  //  1. variant + title + hashtags
  //  2. variant + title              (drop hashtags)
  //  3. variant + truncated title
  //  4. variant alone

  const candidate1 = [args.variant, args.title, hashtags]
    .filter((s) => s.length > 0)
    .join(" ");
  if (candidate1.length <= MAX_TWEET_LEN) return candidate1;

  const candidate2 = [args.variant, args.title].filter((s) => s.length > 0).join(" ");
  if (candidate2.length <= MAX_TWEET_LEN) return candidate2;

  const fixed = args.variant.length + 1; // space before title
  const titleBudget = MAX_TWEET_LEN - fixed;
  if (titleBudget >= 4) {
    const truncated = args.title.slice(0, titleBudget - 1) + "…";
    const candidate3 = [args.variant, truncated].join(" ");
    if (candidate3.length <= MAX_TWEET_LEN) return candidate3;
  }

  if (args.variant.length <= MAX_TWEET_LEN) return args.variant;

  throw new Error(
    `tweet overflow: variant alone (${args.variant.length} chars) exceeds ${MAX_TWEET_LEN}`,
  );
}

// The self-reply body: a bare URL. X auto-renders the OG card from the URL,
// so the reply visually surfaces the same thumbnail + title + description
// the main tweet's image already shows — the user reading the reply gets
// a card preview to click. Keeping it bare avoids burning characters on
// "Read:" or "↓" prefixes that don't add information.
export function composeReplyBody(args: { url: string }): string {
  if (args.url.length === 0) {
    throw new Error("composeReplyBody: url is required");
  }
  if (args.url.length > MAX_TWEET_LEN) {
    throw new Error(
      `reply overflow: url (${args.url.length} chars) exceeds ${MAX_TWEET_LEN}`,
    );
  }
  return args.url;
}
