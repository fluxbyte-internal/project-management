import type {
  ProjectDefaultViewEnum,
  ProjectStatusEnum,
  TaskDependenciesEnum,
  TaskStatusEnum,
  OrgStatusEnum,
  UserRoleEnum,
  ProjectOverAllTrackEnum,
  UserStatusEnum,
  ConsoleStatusEnum,
  HistoryTypeEnum
} from "@prisma/client";
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
  WAITING_ON: 'WAITING_ON',
};

export const TaskStatusEnumValue: EnumStringValueObj<TaskStatusEnum> = {
  NOT_STARTED: 'NOT_STARTED',
  COMPLETED: 'COMPLETED',
};

export const OrgStatusEnumValue: EnumStringValueObj<OrgStatusEnum> = {
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE',
};

export const UserStatusEnumValue: EnumStringValueObj<UserStatusEnum> = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const OperatorStatusEnumValue: EnumStringValueObj<ConsoleStatusEnum> = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const UserRoleEnumValue: EnumStringValueObj<UserRoleEnum> = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  TEAM_MEMBER: 'TEAM_MEMBER',
}

export const ZodErrorMessageEnumValue= {
  REQUIRED : 'Required*'
};

export const HistoryTypeEnumValue: EnumStringValueObj<HistoryTypeEnum> = {
  PROJECT: "PROJECT",
  TASK: "TASK",
};

export const OverAllTrackEnumValue: EnumStringValueObj<ProjectOverAllTrackEnum> = {
  CLOUDY: "CLOUDY",
  RAINY: "RAINY",
  STORMY: "STORMY",
  SUNNY: "SUNNY"
};
