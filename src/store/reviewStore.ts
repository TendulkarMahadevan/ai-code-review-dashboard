import { create } from "zustand";

type ReviewState = {
  selectedRepoId: string | null;
  setSelectedRepoId: (id: string) => void;
};

export const useReviewStore = create<ReviewState>((set) => ({
  selectedRepoId: null,
  setSelectedRepoId: (id) => set({ selectedRepoId: id }),
}));
