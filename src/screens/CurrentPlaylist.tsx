import React from "react"
import { useEffect, useState } from "react"
import SongList from "../components/SongList"
import { Audio } from "../API/audio"
import { useAppSelector } from "../store/store"

function CurrentPlaylist() {
  const [songs, setSongs] = useState<Audio[]>([])
  const [loading, setLoading] = useState(true)
  const playlist = useAppSelector((state) => state.playerState.playlist)


  useEffect(() => {
    if (loading) {
      setSongs(playlist?.music ?? [])
      setLoading(false)
    }
  }, [loading])

  if (songs.length === 0 && !loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh-160px)" }}>
        <h1>Ничего не играет</h1>
      </div>
    )
  }
  return (
    <SongList songs={songs} loading={loading} from={"Current"} />
  )
}
export default CurrentPlaylist
