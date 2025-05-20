import { handleApiError } from "../util/handleApiError";
import { apiClient } from "./apiclient";
import { InterestCategories } from "./interfaces/category";

export const postInterestCorporation = async (id: string) => {
  try {
    const res = await apiClient.post<string>(`/interest-corporations/${id}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 등록에 실패했습니다.");
  }
};

export const postCatecory = async (name: string) => {
  try {
    const res = await apiClient.post<string>(`/categories`, { name });
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 등록에 실패했습니다.");
  }
};

export const postCoporationCategries = async ({
  idList,
  corporationId,
}: InterestCategories) => {
  try {
    const res = await apiClient.post(
      `/interest-corporation-categories/corporations/${corporationId}/categories`,
      { idList }
    );
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 등록에 실패했습니다.");
  }
};
