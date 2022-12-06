import { useRef, useState, useEffect } from "react"

const useAudio = () => {
  const audio = useRef<HTMLAudioElement>(new Audio()).current
    

  const [, _forceUpdate] = useState(false);
  const forceUpdate = () => _forceUpdate(prevState => !prevState);

  useEffect(() => {
    audio.addEventListener("play", forceUpdate);
    audio.addEventListener("pause", forceUpdate);
    audio.addEventListener("ended", forceUpdate);
    audio.addEventListener("timeupdate", forceUpdate);
    audio.addEventListener("volumechange", forceUpdate);
    audio.addEventListener("canplaythrough", forceUpdate);
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
  const changeSource = (url: string) => (audio.src = url);
  const buffered = audio.buffered;

  return [!audio.paused, audio.currentTime, audio.volume, play, pause, updateTime, updateVolume, changeSource, buffered, audio] as const;
};
export default useAudio;