import { AuthorizedAPI } from "../API"
import useLocalStore from "./useLocalStore"
import { useEffect, useState } from "react";
import { store as reduxst } from "../store/store"
import { updateUserLoginAction } from "../store/currentUserReducer"

let vkAPIInstance: null | AuthorizedAPI = null;
let rps = 0;

const useVKAPI = () => {
  // const isLoggedIn = useAppSelector((state) => state.currentUser).logged_in
  const [store, setStore] = useLocalStore("token", "", ".vkm");
  const [vkAPI, setVKAPI] = useState<AuthorizedAPI | null >(null)

  useEffect(() => {
    if (!store) {
      console.log("store is null")
      return;
    } else {
      if (vkAPIInstance) {
        console.log("vkAPIInstance is not null")
        setVKAPI(vkAPIInstance)
        return;
      }
      console.log("store is not null")
      const api = new AuthorizedAPI(store);

      if (rps > 5) {
        console.log("Too many requests")
      }
      api.userGet().then(_ => {
        rps += 1;
        vkAPIInstance = api;
        setVKAPI(api);
        reduxst.dispatch(updateUserLoginAction(true))
      }).catch(e => {
        rps += 1;
        console.log("error", e)
        vkAPIInstance = null;
        setVKAPI(null);
        reduxst.dispatch(updateUserLoginAction(false))
      })
    }
  }, [store])

  const updateVKAPI = (token: string) => {
    setStore(token)
  }

  const logout = () => {
    setStore("")
  }

  return [vkAPI, updateVKAPI, logout] as const;
}

export default useVKAPI;