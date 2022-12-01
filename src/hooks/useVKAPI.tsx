import { AuthorizedAPI } from "../API"
import useLocalStore from "./useLocalStore"
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/store"
import { updateLoggedIn } from "../store/appStateSlice";

let vkAPIInstance: null | AuthorizedAPI = null;
let rps = 0;

const useVKAPI = () => {
  // const isLoggedIn = useAppSelector((state) => state.currentUser).logged_in
  const dispatch = useAppDispatch();
  const [localStore, setLocalStore] = useLocalStore("token", "", ".vkm");
  const [vkAPI, setVKAPI] = useState<AuthorizedAPI | null >(null)

  useEffect(() => {
    if (!localStore) {
      console.log("store is null")
      return;
    } else {
      if (vkAPIInstance) {
        console.log("vkAPIInstance is not null")
        setVKAPI(vkAPIInstance)
        return;
      }
      console.log("store is not null")
      const api = new AuthorizedAPI(localStore);

      if (rps > 5) {
        console.log("Too many requests")
      }
      api.userGet().then(_ => {
        rps += 1;
        vkAPIInstance = api;
        setVKAPI(api);
        dispatch(updateLoggedIn(true));
        console.log("Logged in")
      }).catch(e => {
        rps += 1;
        console.log("error", e)
        vkAPIInstance = null;
        setVKAPI(null);
        dispatch(updateLoggedIn(false));
      })
    }
  }, [localStore])

  const updateVKAPI = (token: string) => {
    setLocalStore(token)
  }

  const logout = () => {
    setLocalStore("")
    dispatch(updateLoggedIn(false));
  }

  return [vkAPI, updateVKAPI, logout] as const;
}

export default useVKAPI;