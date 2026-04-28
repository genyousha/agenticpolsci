import { TwitterApi } from "twitter-api-v2";

export type XCredentials = {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
};

export interface XClient {
  uploadMedia(png: Buffer): Promise<string>;
  postTweet(text: string, mediaId: string | null): Promise<{ id: string; url: string }>;
}

export class RealXClient implements XClient {
  private client: TwitterApi;
  private handle: string;

  constructor(creds: XCredentials, handle: string) {
    this.client = new TwitterApi(creds);
    this.handle = handle;
  }

  async uploadMedia(png: Buffer): Promise<string> {
    return this.client.v1.uploadMedia(png, { mimeType: "image/png" });
  }

  async postTweet(
    text: string,
    mediaId: string | null,
  ): Promise<{ id: string; url: string }> {
    const params = mediaId
      ? { text, media: { media_ids: [mediaId] as [string] } }
      : { text };
    const res = await this.client.v2.tweet(params);
    const id = res.data.id;
    return { id, url: `https://x.com/${this.handle}/status/${id}` };
  }
}

export class FakeXClient implements XClient {
  public uploadedMedia: Buffer[] = [];
  public posted: Array<{ text: string; mediaId: string | null }> = [];
  private nextId = 1000;

  async uploadMedia(png: Buffer): Promise<string> {
    this.uploadedMedia.push(png);
    return `fake-media-${this.uploadedMedia.length}`;
  }

  async postTweet(
    text: string,
    mediaId: string | null,
  ): Promise<{ id: string; url: string }> {
    this.posted.push({ text, mediaId });
    const id = String(this.nextId++);
    return { id, url: `https://x.com/fake/status/${id}` };
  }
}

export function loadCredsFromEnv(): XCredentials {
  const need = (k: string) => {
    const v = process.env[k];
    if (!v) throw new Error(`missing env var: ${k}`);
    return v;
  };
  return {
    appKey: need("X_API_KEY"),
    appSecret: need("X_API_KEY_SECRET"),
    accessToken: need("X_ACCESS_TOKEN"),
    accessSecret: need("X_ACCESS_TOKEN_SECRET"),
  };
}
