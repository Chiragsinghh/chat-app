import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("theme", theme);
  },
}));
