export const strIsNumber = (str: string): boolean => !isNaN(Number(str));

export const strIsDate = (str: string): boolean => !isNaN(Date.parse(str));