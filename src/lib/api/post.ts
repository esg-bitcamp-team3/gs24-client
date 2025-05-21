import { handleApiError } from "../util/handleApiError";
import { apiClient } from "./apiclient";

export const postInterestCorporation = async (id: string) => {
  try {
    const res = await apiClient.post<string>(`/interest-corporations/${id}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 등록에 실패했습니다.");
  }
};

interface CategoryCreate {
  name: string;
}

export const postCategory = async (data: CategoryCreate) => {
  try {
    const res = await apiClient.post<string>(`/categories`, data);
    return res.data;
  } catch (err) {
    handleApiError(err, "신규 카테고리 등록에 실패했습니다.");
  }
};

interface CorporationBulk {
  idList: string[];
}

export const postCorporationCategory = async (
  data: CorporationBulk,
  id: string
) => {
  try {
    const res = await apiClient.post<string>(
      `interest-corporation-categories/categories/${id}/corporations`,
      data
    );
    return res.data;
  } catch (err) {
    handleApiError(err, "기업 등록에 실패했습니다.");
  }
};
