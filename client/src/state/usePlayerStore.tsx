import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {mmkvStorage} from './storage';

interface Podcast {
  id: any;
  audio_uri: string;
  video_uri?: string;
  title: string;
  lyricist: string;
  type: string;
  isFavourite?: boolean;
  artist: any;
  artwork: any;
  category: string;
}

interface PlayerStore {
  user: null | any;
  setUser: (user: any) => void;
  currentPlayingPodcast: Podcast | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  setCurrentPlayingPodcast: (podcast: Podcast) => void;
  setPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    set => ({
      user: null,
      setUser: user => {
        set({user: user});
      },
      currentPlayingPodcast: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
      setCurrentPlayingPodcast: podcast => {
        set({currentPlayingPodcast: podcast, progress: 0, isPlaying: true});
      },
      setPlaying: playing => set({isPlaying: playing}),
      setProgress: progress => set({progress}),
      setDuration: duration => set({duration}),
      resetPlayer: () =>
        set({
          currentPlayingPodcast: null,
          isPlaying: false,
          progress: 0,
          duration: 0,
        }),
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
