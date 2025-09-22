const supportedLanguageIDs = ['en', 'ru'] as const;
type RequireOne<T> = T & { [P in keyof T]: Required<Pick<T, P>> }[keyof T];

export type LanguageID = (typeof supportedLanguageIDs)[number];
export const supportedLanguages = new Set<LanguageID>(supportedLanguageIDs);

export type LanguageRecord<T> = RequireOne<Partial<Record<LanguageID, T>>>;
