import { useRef, useState, useEffect } from "react"

const useAudio = (url: string) => {
  const audio = useRef<HTMLAudioElement>(new Audio(url)).current

  const [, _forceUpdate] = useState(false);
  const forceUpdate = () => _forceUpdate(prevState => !prevState);

  useEffect(() => {
    audio.play();
    audio.addEventListener("play", forceUpdate);
    audio.addEventListener("pause", forceUpdate);
    audio.addEventListener("ended", forceUpdate);
    audio.addEventListener("timeupdate", forceUpdate);
    audio.addEventListener("volumechange", forceUpdate);

    return () => {
      audio.removeEventListener("play", forceUpdate);
      audio.removeEventListener("pause", forceUpdate);
      audio.removeEventListener("ended", forceUpdate);
      audio.addEventListener("timeupdate", forceUpdate);
    };
  }, []);

  const play = () => audio.play();
  const pause = () => audio.pause();
  const updateTime = (value: number) => (audio.currentTime = value);
  const updateVolume = (value: number) => (audio.volume = value);

  return [!audio.paused, audio.currentTime, audio.volume ,play, pause, updateTime, updateVolume, audio] as const;
};
export default useAudio;