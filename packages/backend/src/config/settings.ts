export type Settings = {
  port: string;
};

const { PORT } = process.env;

export const settings: Settings = {
  port: PORT! ?? 8000,
};
