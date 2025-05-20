import { NProject } from '@/@types/work';
import { ERROR_CODE } from '@/constants/error-code';
import { ErrorWithCode } from '@/utils/ErrorWithCode';
import { create } from 'zustand';

interface IWorkSlice {
  wips: NProject.ProjectItem[];
  savedProjects: NProject.ProjectItem[];
  updateWIPs: (wips: NProject.ProjectItem[]) => void;
  updateSavedProjects: (projects: NProject.ProjectItem[]) => void;
  appendWIPProject: (prj: NProject.ProjectItem) => void;
  addSavedProject: (prj: NProject.ProjectItem) => void;
}

const useProjectSlice = create<IWorkSlice>((set, get) => ({
  wips: [],
  savedProjects: [],
  updateWIPs: (wips: NProject.ProjectItem[]) => {
    set({ wips });
  },
  updateSavedProjects: (projects: NProject.ProjectItem[]) => {
    set({ savedProjects: projects });
  },
  appendWIPProject: (prj: NProject.ProjectItem) => {
    const currentWIPPrj = get().wips;
    const newWIPProjects = currentWIPPrj.concat(prj);

    set({
      wips: newWIPProjects,
    });
  },
  addSavedProject: (prj: NProject.ProjectItem) => {
    const currentProjects = get().savedProjects;

    const isDuplicatedProjectName = Boolean(
      currentProjects.find(project => project.name === prj.name)
    );

    if (isDuplicatedProjectName) {
      throw new ErrorWithCode(ERROR_CODE.DUPLICATED_PROJECT_NAME);
    }

    const newSavedList = currentProjects.concat(prj);

    set({
      savedProjects: newSavedList,
    });
  },
}));

export default useProjectSlice;
