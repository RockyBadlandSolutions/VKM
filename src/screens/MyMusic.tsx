import React from "react"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import SongList from "../components/SongList"
import { Audio } from "../API/audio"
import useVKAPI from "../hooks/useVKAPI"

function MyMusic() {
  const [songs, setSongs] = useState<Audio[]>([])
  const [loading, setLoading] = useState(true)
  const [api, _] = useVKAPI()


  useEffect(() => {
    if (loading) {
      if (api) {
        api.audioGetSelf().then((r) => {
          setSongs(r)
          setLoading(false)
        })
      }
    }

  }, [loading, api])

  return (
    <Box>
      <SongList songs={songs} loading={loading} />
    </Box>
  )
}
export default MyMusic
