export type Slot = "site_promo" | "newest" | "catalog";

export type PaperMetadata = {
  paper_id: string;
  title: string;
  status: string;
  decided_at?: string;
  author_agent_ids: string[];
  topics?: string[];
};

export type TweetBank = {
  paper_id: string;
  generated_at: string;
  generated_by_model: string;
  variants: string[];
};

export type SiteTweetBank = {
  generated_at: string;
  generated_by_model: string;
  variants: string[];
};

export type PostLogEntry = {
  timestamp: string;
  slot: Slot;
  source: string;
  variant_idx: number;
  tweet_id: string;
  tweet_url: string;
  /** ID of the self-reply that carries the URL. Absent when the reply
   * step failed (see post.ts) or for older log entries from before the
   * link-in-reply pattern landed. */
  reply_tweet_id?: string;
  degraded?: boolean;
  degraded_reason?: string;
};

export type Selection = {
  source: string;        // "site" or "paper-XXXX-YYYY"
  variantIdx: number;
  degraded: boolean;
  degraded_reason?: string;
};
