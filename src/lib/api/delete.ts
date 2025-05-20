import { handleApiError } from "../util/handleApiError";
import { apiClient } from "./apiclient";

export const deleteInterestCorporation = async (id: string) => {
  try {
    const res = await apiClient.delete<string>(`/interest-corporations/${id}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 삭제에 실패했습니다.");
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 삭제에 실패했습니다.");
  }
};
