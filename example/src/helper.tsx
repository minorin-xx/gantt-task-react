import { Task } from "../../dist/types/public-types";

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 15),
      name: "結婚式準備プロジェクト",
      id: "WeddingProject",
      progress: 10,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 7),
      name: "会場・日取り決定",
      id: "Task_Venue",
      progress: 100,
      type: "task",
      project: "WeddingProject",
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 8),
      name: "衣装選び・試着",
      id: "Task_Dress",
      progress: 30,
      dependencies: ["Task_Venue"],
      type: "task",
      project: "WeddingProject",
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1),
      name: "ゲストリスト作成",
      id: "Task_GuestList",
      progress: 0,
      dependencies: ["Task_Venue"],
      type: "task",
      project: "WeddingProject",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 2),
      name: "招待状発送",
      id: "Task_Invitation",
      progress: 0,
      dependencies: ["Task_GuestList"],
      type: "task",
      project: "WeddingProject",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 4, 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 5, 1),
      name: "料理・装花打ち合わせ",
      id: "Task_Meeting",
      progress: 0,
      dependencies: ["Task_Invitation"],
      type: "task",
      project: "WeddingProject",
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 15),
      name: "❤️ 結婚式当日 ❤️",
      id: "Task_WeddingDay",
      progress: 0,
      type: "milestone",
      dependencies: ["Task_Meeting"],
      project: "WeddingProject",
      displayOrder: 7,
    },
  ];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
