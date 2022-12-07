import React from "react"
import { useEffect, useState } from "react"
import SongList from "../components/SongList"
import { Audio } from "../API/audio"
import useVKAPI from "../hooks/useVKAPI"

function Recommendations() {
  const [songs, setSongs] = useState<Audio[]>([])
  const [loading, setLoading] = useState(true)
  const [api] = useVKAPI()


  useEffect(() => {
    if (loading) {
      if (api) {
        api.audioGetRecommendations().then((r) => {
          setSongs(r)
          setLoading(false)
        })
      }
    }

  }, [loading, api])

  return (
    <SongList songs={songs} loading={loading} from={"Recommendations"} />
  )
}
export default Recommendations
