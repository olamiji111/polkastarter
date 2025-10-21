import { create } from "zustand";
import { UpcomingProject } from "@/types/index";

interface ProjectStore {
  selectedProject: UpcomingProject | null;
  setSelectedProject: (project: UpcomingProject) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  // Initialize from sessionStorage if available
  selectedProject: typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("selectedProject") || "null")
    : null,

  setSelectedProject: (project) => {
    set({ selectedProject: project });

    // Persist to sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedProject", JSON.stringify(project));
    }
  },
}));