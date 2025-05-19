import axios from "axios";

export function handleApiError(
  error: unknown,
  fallbackMessage = "알 수 없는 오류가 발생했습니다."
) {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      console.error("API Error:", error.response.data.message);
      throw new ApiError(error.response.data.message);
    } else {
      console.error("Axios Error:", error.message);
      throw new Error(fallbackMessage);
    }
  } else {
    console.error("Unexpected Error:", error);
    throw new Error(fallbackMessage);
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}
