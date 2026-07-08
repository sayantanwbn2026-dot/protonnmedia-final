import { describe, it, expect } from "vitest";
import { getMediaType, getYouTubeEmbedUrl, getInstagramEmbedUrl } from "@/utils/mediaUtils";

describe("getMediaType", () => {
  it("detects youtube watch and short links", () => {
    expect(getMediaType("https://www.youtube.com/watch?v=abc123")).toBe("youtube");
    expect(getMediaType("https://youtu.be/abc123")).toBe("youtube");
  });

  it("detects instagram links", () => {
    expect(getMediaType("https://www.instagram.com/reel/C0wjMl1LGZn/")).toBe("instagram");
    expect(getMediaType("https://www.instagram.com/p/C0wjMl1LGZn/")).toBe("instagram");
  });

  it("detects images and videos by extension", () => {
    expect(getMediaType("https://cdn.example.com/photo.jpg")).toBe("image");
    expect(getMediaType("https://cdn.example.com/clip.mp4")).toBe("video");
  });

  it("returns unknown for empty or unrecognized urls", () => {
    expect(getMediaType()).toBe("unknown");
    expect(getMediaType("https://example.com/page")).toBe("unknown");
  });
});

describe("getInstagramEmbedUrl", () => {
  it("builds an embed url from a reel link", () => {
    expect(getInstagramEmbedUrl("https://www.instagram.com/reel/C0wjMl1LGZn/")).toBe(
      "https://www.instagram.com/reel/C0wjMl1LGZn/embed"
    );
  });

  it("builds an embed url from a post link with query params", () => {
    expect(getInstagramEmbedUrl("https://www.instagram.com/p/C0wjMl1LGZn/?utm_source=ig_web")).toBe(
      "https://www.instagram.com/p/C0wjMl1LGZn/embed"
    );
  });

  it("normalizes plural /reels/ to singular /reel/", () => {
    expect(getInstagramEmbedUrl("https://instagram.com/reels/ABC-123_xyz/")).toBe(
      "https://www.instagram.com/reel/ABC-123_xyz/embed"
    );
  });

  it("handles username-prefixed post and reel links", () => {
    expect(getInstagramEmbedUrl("https://www.instagram.com/natgeo/reel/CxYz123/")).toBe(
      "https://www.instagram.com/reel/CxYz123/embed"
    );
  });

  it("supports /tv/ links", () => {
    expect(getInstagramEmbedUrl("https://www.instagram.com/tv/CxYz123/")).toBe(
      "https://www.instagram.com/tv/CxYz123/embed"
    );
  });

  it("returns null for non-embeddable profile links", () => {
    expect(getInstagramEmbedUrl("https://www.instagram.com/protonn.media/")).toBeNull();
    expect(getInstagramEmbedUrl("https://www.instagram.com/protonn.media?igsh=abc")).toBeNull();
  });
});

describe("getYouTubeEmbedUrl (unchanged behavior)", () => {
  it("converts watch and short links to embed urls", () => {
    expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123"
    );
    expect(getYouTubeEmbedUrl("https://youtu.be/abc123")).toBe(
      "https://www.youtube.com/embed/abc123"
    );
  });
});
