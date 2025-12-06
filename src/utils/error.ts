export interface CustomError {
  status: number;
  message: string;
}

export function createCustomError(status: number, message: string): CustomError {
  return { status, message };
}

export function isCustomError(error: any): error is CustomError {
  return error && typeof error.status === "number" && typeof error.message === "string";
}
