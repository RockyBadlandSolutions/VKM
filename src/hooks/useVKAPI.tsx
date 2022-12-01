import { AuthorizedAPI } from "../API"
import useLocalStore from "./useLocalStore"
import { useEffect, useState } from "react";
import { store as reduxst } from "../store/store"
import { updateUserLoginAction } from "../store/currentUserReducer"

const useVKAPI = () => {
  const [store, setStore] = useLocalStore();
  const [vkAPI, setVKAPI] = useState<AuthorizedAPI | null >(null)

  useEffect(() => {
    if (!store) {
      console.log("store is null")
      return;
    }
    const init = async () => {
      const api = new AuthorizedAPI(store)
      return await api.userGet()
    }
    init().then((r) => {
      console.log(r)
      setVKAPI(new AuthorizedAPI(store))
      reduxst.dispatch(updateUserLoginAction(true))
      return r
    }).catch((e) => {
      console.log("Error", e)
      setStore(null)
      reduxst.dispatch(updateUserLoginAction(false))
    })
  }, [store])

  const updateVKAPI = (token: string) => {
    setStore(token)
  }

  return [vkAPI, updateVKAPI] as const;
}

export default useVKAPI;