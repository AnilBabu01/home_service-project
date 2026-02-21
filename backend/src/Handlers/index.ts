import { Response } from "express";

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface SuccessResponse {
  status?: boolean;
  msg?: string;
  data?: any[];
  pagination?: Pagination;
  extraData?: any
}

interface ErrorResponse {
  status?: boolean;
  msg?: string;
  error?: any[];
  statuscode?: number;
}

export const success = (res: Response, response: SuccessResponse) => {
  response.data = response.data ?? [];
  return res.status(200).json(response);
};

export const error = (res: Response, error: ErrorResponse) => {
  const statusCode = error.statuscode ?? 400;
  const err = error.error ?? [];
  const formattedError = { status: error.status, msg: error.msg, error: err };
  return res.status(statusCode).json(formattedError);
};

export const generatePassword = (name: string) => {
  const specialChars = "!@#$%^&*()_+[]{}";
  const numbers = "0123456789";

  let base = name
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  let password = base.slice(0, 4);

  while (password.length < 10) {
    let randomChar =
      specialChars[Math.floor(Math.random() * specialChars.length)];
    let randomNum = numbers[Math.floor(Math.random() * numbers.length)];
    password += randomChar + randomNum;

    if (password.length > 10) {
      password = password.slice(0, 10);
    }
  }

  return password;
};
