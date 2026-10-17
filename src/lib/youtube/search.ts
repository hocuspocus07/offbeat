export type YouTubeSearchResult = {
  videoId: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  videoUrl: string;
};

type YouTubeThumbnail = { url?: string };
type YouTubeApiItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      default?: YouTubeThumbnail;
    };
  };
};
type YouTubeApiResponse = {
  items?: YouTubeApiItem[];
  error?: { errors?: Array<{ reason?: string }>; message?: string };
};

export class YouTubeSearchError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly publicMessage: string,
  ) {
    super(message);
    this.name = "YouTubeSearchError";
  }
}

export async function searchYouTubeVideos(
  query: string,
  limit = 12,
): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new YouTubeSearchError(
      "YOUTUBE_API_KEY is not configured.",
      503,
      "YouTube search is not configured yet. Add YOUTUBE_API_KEY to the server environment.",
    );
  }

  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet",
    type: "video",
    q: query,
    maxResults: String(limit),
    videoEmbeddable: "true",
    safeSearch: "moderate",
    regionCode: "IN",
    relevanceLanguage: "en",
  });

  let response: Response;
  try {
    response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { method: "GET", cache: "no-store" },
    );
  } catch (error) {
    throw new YouTubeSearchError(
      error instanceof Error ? error.message : "Network error",
      502,
      "Could not reach YouTube. Check your connection and try again.",
    );
  }

  const payload = (await response.json().catch(() => ({}))) as YouTubeApiResponse;
  if (!response.ok) {
    const reason = payload.error?.errors?.[0]?.reason ?? "";
    const message = payload.error?.message ?? `YouTube API returned ${response.status}`;

    if (
      response.status === 403 &&
      (reason === "quotaExceeded" || reason === "dailyLimitExceeded")
    ) {
      throw new YouTubeSearchError(
        message,
        429,
        "YouTube search has reached its API quota. Try again after the quota resets.",
      );
    }

    if (response.status === 400 || response.status === 403) {
      throw new YouTubeSearchError(
        message,
        502,
        "YouTube rejected the search request. Check the API key and YouTube Data API v3 settings.",
      );
    }

    throw new YouTubeSearchError(
      message,
      502,
      "YouTube search is temporarily unavailable.",
    );
  }

  return (payload.items ?? [])
    .map((item): YouTubeSearchResult | null => {
      const snippet = item.snippet;
      const videoId = item.id?.videoId;
      if (!videoId || !snippet?.title || !snippet.channelTitle) return null;

      return {
        videoId,
        title: snippet.title,
        description: snippet.description ?? "",
        channelId: snippet.channelId ?? "",
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt ?? "",
        thumbnailUrl:
          snippet.thumbnails?.high?.url ??
          snippet.thumbnails?.medium?.url ??
          snippet.thumbnails?.default?.url ??
          null,
        videoUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
      };
    })
    .filter((item): item is YouTubeSearchResult => item !== null);
}
