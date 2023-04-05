import React from "react"
import { useEffect, useState } from "react"
import SongList from "../components/SongList"
import { useAppSelector } from "../store/store"
import { Audio } from "../API/audio"
import useVKAPI from "../hooks/useVKAPI"

const Search = () => {
  const search = useAppSelector((state) => state.appState.search)
  const [api, _] = useVKAPI();
  const [loading, setLoading] = useState(true)
  const [songs, setSongs] = useState<Audio[]>([])

  useEffect(() => {
    setLoading(true)
    if (search !== "" && search !== undefined && search !== null && api) {
      api.audioSearch(search).then((r) => {
        setSongs(r)
        setLoading(false)
      })
    }
  }, [search])
  return <SongList songs={songs} loading={loading} from={"MyMusic"}/>
}

export default Search
