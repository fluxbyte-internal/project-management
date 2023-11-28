import type { ProjectDefaultViewEnum, ProjectStatusEnum, TaskDependenciesEnum, TaskStatusEnum } from "@prisma/client";
import type { EnumStringValueObj } from "../types/enumStringValueObject.js";

export const ProjectDefaultViewEnumValue: EnumStringValueObj<ProjectDefaultViewEnum> = {
  CALENDAR: 'CALENDAR',
  GANTT: 'GANTT',
  KANBAN: 'KANBAN',
  LIST: 'LIST'
};

export const ProjectStatusEnumValue: EnumStringValueObj<ProjectStatusEnum> = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  NOT_STARTED: 'NOT_STARTED',
  ON_HOLD: 'ON_HOLD'
};

export const TaskDependenciesEnumValue: EnumStringValueObj<TaskDependenciesEnum> = {
  BLOCKING: 'BLOCKING',
  WAITING_ON: 'WAITING_ON'
};

export const TaskStatusEnumValue: EnumStringValueObj<TaskStatusEnum> = {
  NOT_STARTED: 'NOT_STARTED',
  COMPLETED: 'COMPLETED'
};