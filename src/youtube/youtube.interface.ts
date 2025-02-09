export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  localized: string;
  publishedAt: string;
  customUrl: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  country: string;
  statistics: {
    viewCount: string;
    commentCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}
export interface VideoPlaylist {
  id: string;
  title: string;
  description: string;
}

export interface VideoUpload {
  id: string;
  title: string;
  description: string;
  tags: string[];
  categoryId: VideoCategoryEnums;
  privacyStatus: "public" | "private" | "unlisted";
  publishAt: string;
  notifySubscribers: boolean;
  playlistIds: Array<string>;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
}

export interface YoutubeUploadBatch {
  id: string;
  tags: string[];
  hashTags: string[];
  description: string;
  channelId: string;
  channelTitle: string;
  playlistIds: string[];
  categoryId: VideoCategoryEnums;
  publishGapHrs: number; // Ex. Every 2 hour, means 12 videos per day
  videos: {
    id: string;
    videoRecordId: string;
  };
}

export enum VideoCategoryEnums {
  "Film & Animation" = "1",
  "Autos & Vehicles" = "2",
  "Music" = "10",
  "Pets & Animals" = "15",
  "Sports" = "17",
  "Short Movies" = "18",
  "Travel & Events" = "19",
  "Gaming" = "20",
  "Videoblogging" = "21",
  "People & Blogs" = "22",
  "Comedy" = "23",
  "Entertainment" = "24",
  "News & Politics" = "25",
  "Howto & Style" = "26",
  "Education" = "27",
  "Science & Technology" = "28",
  "Nonprofits & Activism" = "29",
  "Movies" = "30",
  "Anime/Animation" = "31",
  "Action/Adventure" = "32",
  "Classics" = "33",
  "Documentary" = "35",
  "Drama" = "36",
  "Family" = "37",
  "Foreign" = "38",
  "Horror" = "39",
  "Sci-Fi/Fantasy" = "40",
  "Thriller" = "41",
  "Shorts" = "42",
  "Shows" = "43",
  "Trailers" = "44",
}
