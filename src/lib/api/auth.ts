import { handleApiError } from "@/lib/util/handleApiError";
import { apiClient } from "@/lib/api/apiclient";
import { LoginForm, SignupForm, UpdateUser, User } from "./interfaces/auth";

export async function signup(data: Partial<SignupForm>) {
  try {
    const response = await apiClient.post<string>("/auth/signup", data);
    return response.data;
  } catch (error) {
    handleApiError(error, "회원가입에 실패했습니다.");
  }
}

export async function login(data: Partial<LoginForm>) {
  try {
    const response = await apiClient.post<string>("/auth/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      handleApiError(error, "이메일 또는 비밀번호가 잘못되었습니다.");
    } else {
      handleApiError(error, "로그인에 실패했습니다.");
    }
  }
}

export async function logout() {
  try {
    const response = await apiClient.post<string>("/auth/logout");
    return response.data;
  } catch (error) {
    handleApiError(error, "로그아웃에 실패했습니다.");
  }
}

export async function checkLogin() {
  try {
    const response = await apiClient.get("/user/check");
    console.log("checkLogin response:", response, { withCredentials: true }); // 세션 쿠키를 자동으로 보냄
    return response.data;
  } catch (error) {
    // handleApiError(error, '로그인이 필요합니다.')
    return false;
  }
}

export async function getUserInfo() {
  try {
    const response = await apiClient.get<User>(`/user/mypage`);
    return response.data;
  } catch (error) {
    handleApiError(error, "로그인이 필요합니다.");
  }
}

export async function updateUserInfo(data: Partial<UpdateUser>) {
  try {
    const response = await apiClient.patch<string>("/user", data);
    console.log(response);
    return response.data;
  } catch (error) {
    handleApiError(error, "수정 실패");
  }
}

interface checkingPassword {
  password: string;
}

export async function checkingPassword(data: checkingPassword) {
  try {
    const res = await apiClient.post<string>("/user/check-password", data);
    return res.data; // true 또는 false
  } catch (error) {
    return false;
  }
}

export async function updatePassword(password: string) {
  try {
    const response = await apiClient.patch("/user/password", password);
    return response.data;
  } catch (error) {
    handleApiError(error, "비밀번호 변경 실패");
  }
}
