import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Store } from "tauri-plugin-store-api";

const stores: any = {};
const SAVE_DELAY = 1000;

function getLocalStore(filename: string) {
  if (!(filename in stores)) stores[filename] = new Store(filename);
  return stores[filename];
}

export function useLocalStore(key: string, defaultValue: string, storeName = ".vkm") {
  // storeName is a path that is relative to AppData if not absolute
  const [state, setState] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const store = getLocalStore(storeName);
  const timeoutRef = useRef<any>(null);

  // useLayoutEffect will be called before DOM paintings and before useEffect
  useLayoutEffect(() => {
    let allow = true;
    store.get(key)
      .then((value: string) => {
        if (value === null) throw "";
        if (allow) setState(value);
      }).catch(() => {
        store.set(key, defaultValue).then(() => {
          timeoutRef.current = setTimeout(() => store.save(), SAVE_DELAY)
        });
      })
      .then(() => {
        if (allow) setLoading(false);
      });
    return () => allow = false;
  }, []);

  // useLayoutEffect does not like Promise return values.
  useEffect(() => {
    // do not allow setState to be called before data has even been loaded!
    if (!loading) {
      clearTimeout(timeoutRef.current);
      store.set(key, state).then(() => {
        timeoutRef.current = setTimeout(() => store.save(), SAVE_DELAY)
      });
    }
  }, [state]);
  return [state, setState, loading] as const;
}

export default useLocalStore;