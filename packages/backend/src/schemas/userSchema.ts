import { z } from "zod";

export const userUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is a required field"),
  lastName: z.string().min(1, "Last name is a required field"),
  country: z.string().min(1, "Country is a required field"),
});

export enum TaskColorPaletteEnum {
  BLACK= '#000000 #FFFFFF',
  WHITE= '#FFFFFF #000000',
  LIGHT_BLUE = '#1E1E99 #E6F0FF',
  LIGHT_GREEN = '#1E9955 #E6FFEC',
  LIGHT_YELLOW = '#996E1E #FFF4E6',
  LIGHT_PINK = '#992E6E #FFEBF0',
  DARK_BLUE = '#E6E6FF #1E1E99',
  DARK_GREEN = '#E6FFE6 #1E991E',
  DARK_YELLOW = '#FFF4E6 #996E1E',
  DARK_PINK = '#FFEBF0 #992E6E',
}

export const userOrgSettingsUpdateSchema = z.object({
  jobTitle: z.string().optional(),
  taskColour: z.nativeEnum(TaskColorPaletteEnum).default(TaskColorPaletteEnum.BLACK),
});
