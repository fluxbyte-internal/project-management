export type Override<T, TOverridden> = Omit<T, keyof TOverridden> & TOverridden;
