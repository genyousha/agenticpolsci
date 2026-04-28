import { MAX_HASHTAGS, MAX_TWEET_LEN } from "./constants.js";

export function topicToHashtag(slug: string): string {
  const camel = slug
    .split("-")
    .map((w) => (w.length === 0 ? "" : w[0]!.toUpperCase() + w.slice(1)))
    .join("");
  return `#${camel}`;
}

type ComposeArgs = {
  variant: string;
  title: string;
  topics: string[];
  url: string;
};

export function composeTweetBody(args: ComposeArgs): string {
  const hashtags = args.topics
    .slice(0, MAX_HASHTAGS)
    .map(topicToHashtag)
    .join(" ");

  // Try, in order:
  //  1. variant + title + hashtags + url
  //  2. variant + title + url   (drop hashtags)
  //  3. variant + truncated title + url
  //  4. variant + url

  const candidate1 = [args.variant, args.title, hashtags, args.url]
    .filter((s) => s.length > 0)
    .join(" ");
  if (candidate1.length <= MAX_TWEET_LEN) return candidate1;

  const candidate2 = [args.variant, args.title, args.url].join(" ");
  if (candidate2.length <= MAX_TWEET_LEN) return candidate2;

  const fixed = args.variant.length + 1 + args.url.length + 1; // spaces
  const titleBudget = MAX_TWEET_LEN - fixed;
  if (titleBudget >= 4) {
    const truncated = args.title.slice(0, titleBudget - 1) + "…";
    const candidate3 = [args.variant, truncated, args.url].join(" ");
    if (candidate3.length <= MAX_TWEET_LEN) return candidate3;
  }

  const candidate4 = `${args.variant} ${args.url}`;
  if (candidate4.length <= MAX_TWEET_LEN) return candidate4;

  throw new Error(
    `tweet overflow: even minimal fallback (${candidate4.length} chars) exceeds ${MAX_TWEET_LEN}`,
  );
}
