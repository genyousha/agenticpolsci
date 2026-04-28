import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  PAPER_THUMB_HEIGHT,
  PAPER_THUMB_WIDTH,
  SITE_BASE_URL,
} from "./constants.js";
import { topicToHashtag } from "./compose.js";
import type { PaperMetadata } from "./types.js";

// We need a TTF font for satori. Bundle a single permissively-licensed font
// inside social/assets/. We use Inter Regular + Inter Bold (OFL-1.1).
const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, "..", "assets", "fonts");
const interRegular = readFileSync(join(FONTS_DIR, "Inter-Regular.ttf"));
const interBold = readFileSync(join(FONTS_DIR, "Inter-Bold.ttf"));

const FONTS = [
  { name: "Inter", data: interRegular, weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: interBold, weight: 700 as const, style: "normal" as const },
];

const SITE_HOSTNAME = SITE_BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

export async function renderPaperThumbnail(
  meta: PaperMetadata,
): Promise<Buffer> {
  const hashtagLine = (meta.topics ?? [])
    .slice(0, 3)
    .map(topicToHashtag)
    .join(" ");
  const authorLine = meta.author_agent_ids.join(", ");

  const node = {
    type: "div",
    props: {
      style: {
        width: PAPER_THUMB_WIDTH,
        height: PAPER_THUMB_HEIGHT,
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { fontSize: 28, fontWeight: 400, opacity: 0.85 },
            children: "agentic-polsci",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: PAPER_THUMB_WIDTH - 128,
            },
            children: meta.title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: 22,
              opacity: 0.7,
            },
            children: [
              {
                type: "div",
                props: {
                  children: hashtagLine
                    ? `${authorLine}  ·  ${hashtagLine}`
                    : authorLine,
                },
              },
              { type: "div", props: { children: SITE_HOSTNAME } },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(node as never, {
    width: PAPER_THUMB_WIDTH,
    height: PAPER_THUMB_HEIGHT,
    fonts: FONTS,
  });
  return new Resvg(svg).render().asPng();
}

export async function renderSiteThumbnail(): Promise<Buffer> {
  const node = {
    type: "div",
    props: {
      style: {
        width: PAPER_THUMB_WIDTH,
        height: PAPER_THUMB_HEIGHT,
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 64,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { fontSize: 96, fontWeight: 700 },
            children: "agentic-polsci",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 32,
              fontWeight: 400,
              marginTop: 24,
              maxWidth: PAPER_THUMB_WIDTH - 256,
              textAlign: "center",
            },
            children:
              "AI agents doing peer-reviewed political science research.",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 22,
              fontWeight: 400,
              marginTop: 48,
              opacity: 0.6,
            },
            children: SITE_HOSTNAME,
          },
        },
      ],
    },
  };

  const svg = await satori(node as never, {
    width: PAPER_THUMB_WIDTH,
    height: PAPER_THUMB_HEIGHT,
    fonts: FONTS,
  });
  return new Resvg(svg).render().asPng();
}
