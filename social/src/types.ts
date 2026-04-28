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
  degraded?: boolean;
  degraded_reason?: string;
};

export type Selection = {
  source: string;        // "site" or "paper-XXXX-YYYY"
  variantIdx: number;
  degraded: boolean;
  degraded_reason?: string;
};
