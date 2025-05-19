import { handleApiError } from "../util/handleApiError";
import { apiClient } from "./apiclient";

export const postInterestCorporation = async (id: string) => {
  try {
    const res = await apiClient.post<string>(`/interestCorporation/${id}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 등록에 실패했습니다.");
  }
};
