export const navItems = ["Settings", "Editor"];
export const dbNames = ['Quote', 'QuoteReel', 'RelaxingVideo', 'DustVideo', 'MantrasVideo'];
export const MAX_HASHTAGS_IN_TITLE = 3;
export const REMOTION_BUNDLE_PATH = 'dist';
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.webp'];
export const ALLOWED_MUSIC_EXTENSIONS = ['.mp3'];
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4'];
export const ALLOWED_EXTENSIONS = [...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_MUSIC_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS];
export const PROMPT_FORMAT = `
Use Format: JSON
Schema: [
  {
    name,
    title,
    subTitle,
    summary,
    translation,
    tags,
    hashTags
  }
]
tags and hashTags should be in English language and name, title, and summary should be in hindi.
max length of summary should be 200 characters.
translation should be the English translation of summary`;
export const PROMPT_TEXT = `10 Facts about history and importance of Kumbh Mela`
