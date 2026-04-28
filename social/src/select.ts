import { COOLDOWN_DAYS, NEWEST_RECENT_HOURS } from "./constants.js";
import type {
  PaperMetadata,
  PostLogEntry,
  Selection,
  Slot,
} from "./types.js";

type SelectArgs = {
  slot: Slot;
  papers: PaperMetadata[];
  log: PostLogEntry[];
  siteVariantCount: number;
  paperVariantCounts?: Record<string, number>;
  now: Date;
};

export function selectForSlot(args: SelectArgs): Selection {
  switch (args.slot) {
    case "site_promo":
      return selectSite(args);
    case "newest":
      return selectNewest(args);
    case "catalog":
      return selectCatalog(args);
  }
}

function selectSite(args: SelectArgs): Selection {
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    "site",
    args.siteVariantCount,
  );
  return { source: "site", variantIdx, degraded: false };
}

function selectNewest(args: SelectArgs): Selection {
  const accepted = args.papers
    .filter((p) => p.status === "accepted" && p.decided_at)
    .sort(
      (a, b) =>
        new Date(b.decided_at!).getTime() - new Date(a.decided_at!).getTime(),
    );

  if (accepted.length < 2) {
    return degradeToSite(args, "newest_lt2_accepted_papers");
  }

  const newest = accepted[0]!;
  const recentCutoff = new Date(
    args.now.getTime() - NEWEST_RECENT_HOURS * 60 * 60 * 1000,
  );
  const newestPostedRecently = args.log.some(
    (e) =>
      e.source === newest.paper_id && new Date(e.timestamp) >= recentCutoff,
  );

  const chosen = newestPostedRecently ? accepted[1]! : newest;
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    chosen.paper_id,
    args.paperVariantCounts?.[chosen.paper_id] ?? 1,
  );
  return { source: chosen.paper_id, variantIdx, degraded: false };
}

function selectCatalog(args: SelectArgs): Selection {
  const cutoff = new Date(
    args.now.getTime() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
  );
  const recentlyPostedPaperIds = new Set(
    args.log
      .filter((e) => new Date(e.timestamp) >= cutoff && e.source.startsWith("paper-"))
      .map((e) => e.source),
  );

  const eligible = args.papers
    .filter((p) => p.status === "accepted")
    .filter((p) => !recentlyPostedPaperIds.has(p.paper_id));

  if (eligible.length === 0) {
    return degradeToSite(args, "catalog_cooldown_empty");
  }

  // Sort: oldest most-recent-post first (fully-unposted papers float to top
  // because lastPosted is null). Tie-break: oldest decided_at first.
  const lastPostedAt = new Map<string, number>();
  for (const e of args.log) {
    if (!e.source.startsWith("paper-")) continue;
    const t = new Date(e.timestamp).getTime();
    const prev = lastPostedAt.get(e.source);
    if (prev === undefined || t > prev) lastPostedAt.set(e.source, t);
  }

  eligible.sort((a, b) => {
    const aLast = lastPostedAt.get(a.paper_id) ?? 0;
    const bLast = lastPostedAt.get(b.paper_id) ?? 0;
    if (aLast !== bLast) return aLast - bLast;
    const aDec = new Date(a.decided_at!).getTime();
    const bDec = new Date(b.decided_at!).getTime();
    return aDec - bDec;
  });

  const chosen = eligible[0]!;
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    chosen.paper_id,
    args.paperVariantCounts?.[chosen.paper_id] ?? 1,
  );
  return { source: chosen.paper_id, variantIdx, degraded: false };
}

function degradeToSite(args: SelectArgs, reason: string): Selection {
  const variantIdx = leastRecentlyUsedVariant(
    args.log,
    "site",
    args.siteVariantCount,
  );
  return {
    source: "site",
    variantIdx,
    degraded: true,
    degraded_reason: reason,
  };
}

function leastRecentlyUsedVariant(
  log: PostLogEntry[],
  source: string,
  variantCount: number,
): number {
  const lastUsed = new Map<number, number>();
  for (const e of log) {
    if (e.source !== source) continue;
    const t = new Date(e.timestamp).getTime();
    const prev = lastUsed.get(e.variant_idx);
    if (prev === undefined || t > prev) lastUsed.set(e.variant_idx, t);
  }

  let bestIdx = 0;
  let bestTime = Infinity;
  for (let i = 0; i < variantCount; i++) {
    const t = lastUsed.get(i);
    if (t === undefined) {
      // never used — best possible; lowest index wins by virtue of order.
      return i;
    }
    if (t < bestTime) {
      bestTime = t;
      bestIdx = i;
    }
  }
  return bestIdx;
}
