/**
 * ═══════════════════════════════════════════════════════════════════════
 * TrainerOS — Video Parsing & Formatting Utility
 * 
 * Supports:
 * - YouTube standard: youtube.com/watch?v=ID (any query params)
 * - YouTube short: youtu.be/ID
 * - YouTube Shorts: youtube.com/shorts/ID (vital for mobile gym videos)
 * - YouTube embed: youtube.com/embed/ID
 * - Vimeo: vimeo.com/ID
 * - Direct video files: mp4, webm, ogg, mov, Supabase public storage, blob
 * - External video fallback: TikTok, Instagram Reels, Drive
 * ═══════════════════════════════════════════════════════════════════════
 */

export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'direct' | 'unsupported' | 'none'
  embedUrl: string | null
  thumbnailUrl: string | null
  rawUrl: string | null
  originalInput: string
  isShorts?: boolean
}

export function parseVideoUrl(inputUrl?: string | null): ParsedVideo {
  if (!inputUrl) {
    return {
      type: 'none',
      embedUrl: null,
      thumbnailUrl: null,
      rawUrl: null,
      originalInput: '',
      isShorts: false,
    }
  }

  let url = inputUrl.trim()
  if (!url) {
    return {
      type: 'none',
      embedUrl: null,
      thumbnailUrl: null,
      rawUrl: null,
      originalInput: inputUrl,
      isShorts: false,
    }
  }

  // Prepend https:// if protocol is omitted
  if (!/^https?:\/\//i.test(url) && !url.startsWith('blob:') && !url.startsWith('data:')) {
    url = 'https://' + url
  }

  // 1. YouTube Matcher
  // Matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://www.youtube.com/watch?feature=shared&v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  const ytRegex = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  const ytMatch = url.match(ytRegex)
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1]
    const isShorts = /[\/\.]shorts\//i.test(url)
    return {
      type: 'youtube',
      // YouTube-nocookie for privacy and reliable iframe loading
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      rawUrl: url,
      originalInput: inputUrl,
      isShorts,
    }
  }

  // 2. Vimeo Matcher
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)|player\.vimeo\.com\/video\/(\d+))/i
  const vimeoMatch = url.match(vimeoRegex)
  const vimeoId = vimeoMatch ? (vimeoMatch[3] || vimeoMatch[4]) : null
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`,
      thumbnailUrl: null,
      rawUrl: url,
      originalInput: inputUrl,
    }
  }

  // 3. Direct video format (mp4, webm, ogg, mov, m4v or Supabase storage)
  const isDirect =
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) ||
    url.includes('/storage/v1/object/public/') ||
    url.startsWith('blob:') ||
    url.startsWith('data:video/')

  if (isDirect) {
    return {
      type: 'direct',
      embedUrl: null,
      thumbnailUrl: null,
      rawUrl: url,
      originalInput: inputUrl,
    }
  }

  // 4. External or unsupported format (e.g. TikTok, Instagram, generic links)
  return {
    type: 'unsupported',
    embedUrl: null,
    thumbnailUrl: null,
    rawUrl: url,
    originalInput: inputUrl,
  }
}
