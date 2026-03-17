export const getMediaType = (url?: string) => {
  if (!url) return 'unknown';
  
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    return 'youtube';
  }
  if (url.includes('instagram.com/')) {
    return 'instagram';
  }
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(url)) {
    return 'image';
  }
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)) {
    return 'video';
  }
  return 'unknown';
};

export const getYouTubeEmbedUrl = (url: string) => {
  try {
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('/').pop() || '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (e) {
    return url;
  }
};

export const getYouTubeThumbnailUrl = (url: string) => {
  try {
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      // Handle youtu.be/VIDEO_ID?attr=...
      const cleanUrl = url.split('?')[0];
      videoId = cleanUrl.split('/').pop() || '';
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  } catch (e) {
    return null;
  }
};
