export interface Audio {
  access_key: string
  ads?: any
  album?: Album
  artist: string
  date: number
  duration: number
  id: number
  is_explicit: boolean
  is_focus_track: boolean
  is_licensed: boolean
  main_artists?: Artist[]
  owner_id: number
  short_videos_allowed: boolean
  stories_allowed: boolean
  stories_cover_allowed: boolean
  title: string | null
  track_code: string
  url: string
}

export interface Album {
  id: number
  owner_id: number
  title: string
  access_key: string
  thumb?: Thumb
}

export interface Artist {
  id: number
  can_follow: boolean
  domain: string
  is_followed: boolean
  name: string
}

export interface Thumb {
  width: number
  height: number
  photo_3: string
  photo_68: string
  photo_135: string
  photo_270: string
  photo_300: string
  photo_600: string
  photo_1200: string
}
