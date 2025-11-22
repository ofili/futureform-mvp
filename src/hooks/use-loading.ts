import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  setLoading: (loading: boolean, text?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: undefined,
  setLoading: (loading, text) => set({ isLoading: loading, loadingText: text })
}));

export const useLoading = () => {
  const { isLoading, loadingText, setLoading } = useLoadingStore();
  
  const startLoading = (text?: string) => setLoading(true, text);
  const stopLoading = () => setLoading(false);
  
  return { isLoading, loadingText, startLoading, stopLoading };
};