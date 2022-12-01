import { useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";
let instance: Store | null = null;

export function getStore() {
  if(!instance) instance = new Store(".VKMData.dat");
  return instance;
}

const useLocalStore = () => {
  const store = getStore();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    store.get("t").then((r) => {
      setData(r);
    });
    store.onChange(() => {
      store.get("t").then((r) => {
        setData(r);
      })
    })
  }, [])

  const setStore = (data: any) => {
    setData(data);
  }

  return [data, setStore] as const;
}

export default useLocalStore;