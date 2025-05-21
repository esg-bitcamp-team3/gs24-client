import { handleApiError } from "../util/handleApiError";
import { apiClient } from "./apiclient";
import { CompanyInfo, InterestCompanyInfo } from "./interfaces/companyinfo";
import {
  Category,
  CategoryCorporation,
  Corporation,
  CorporationsWithInterestPage,
  InterestCorporation,
} from "./interfaces/corporation";

import { EsgRatingResponse } from "./interfaces/esgRating";
import { EsgTerm } from "./interfaces/esgTerms";
import {
  OrganizationInfoResponse,
  OrganizationRank,
} from "./interfaces/interestOrganization";
import { OrganizationWithInterestPage } from "./interfaces/organizations";

export const getOrganizations = async () => {
  try {
    const res = await apiClient.get("/organizations");
    return res.data;
  } catch (err) {
    console.error("❌ 회사 목록 가져오기 실패:", err);
    throw err;
  }
};

export const getOrganizationsWithInterest = async (page: number) => {
  try {
    const res = await apiClient.get<OrganizationWithInterestPage>(
      "/interestOrganization/organizations",
      { params: { page } }
    );
    return res.data;
  } catch (err) {
    console.error("❌ 회사 목록 가져오기 실패:", err);
    throw err;
  }
};

export async function getEsgRatingByOrganization(organizationId: string) {
  try {
    const response = await apiClient.get<EsgRatingResponse>(
      `/esg-ratings/${organizationId}`
    );
    console.log("response", response);

    return response.data;
  } catch (error) {
    handleApiError(error, "getEsgRatingByOrganization");
  }
}

export async function getOrganizationInfo(id: string) {
  try {
    const response = await apiClient.get<string>(`/organizations/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "기업 정보를 가져오는 데 실패했습니다.");
  }
}

export async function getInterestOrganization() {
  try {
    const response = await apiClient.get<OrganizationInfoResponse>(
      "/interestOrganization"
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "관심기업 정보를 가져오는 데 실패했습니다.");
  }
}

export async function getInterestCompanyInfo() {
  try {
    const response = await apiClient.get<InterestCompanyInfo[]>(
      "/interestOrganization/interest"
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, "관심기업 정보를 가져오는 데 실패했습니다.");
  }
}

export async function getOrganizationRank() {
  try {
    const response = await apiClient.get<OrganizationRank[]>("/ranking/score");
    return response.data;
  } catch (error) {
    handleApiError(error, "기업 정보를 가져오는 데 실패했습니다.");
  }
}

export async function getCompanyInfo(id: string) {
  try {
    const response = await apiClient.get<CompanyInfo>(`/company/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "기업 정보를 가져오는 데 실패했습니다.");
  }
}

export async function getEsgTerms() {
  try {
    const response = await apiClient.get<EsgTerm[]>(`/terms`);
    return response.data;
  } catch (error) {
    handleApiError(error, "기업 정보를 가져오는 데 실패했습니다.");
  }
}

// ================================== corporation
export async function getCorporationList() {
  try {
    const response = await apiClient.get<Corporation[]>("/corporations");
    return response.data;
  } catch (error) {
    handleApiError(error, "기업 정보를 가져오는 데 실패했습니다.");
  }
}

export async function getCorporationInfo(id: string) {
  try {
    const response = await apiClient.get<Corporation>(`/corporations/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "기업 정보를 가져오는 데 실패했습니다.");
  }
}

export const getCorporationsWithInterest = async () => {
  try {
    const res = await apiClient.get<CorporationsWithInterestPage>(
      "/interest-corporations/corporations"
    );
    return res.data;
  } catch (err) {
    console.error("❌ 회사 목록 가져오기 실패:", err);
    throw err;
  }
};

export const getInterestCorporation = async (id: string) => {
  try {
    const res = await apiClient.get<boolean>(`/interest-corporations/${id}`);
    return res.data;
  } catch (err) {
    handleApiError(err, "관심기업 찾기 실패");
  }
};

export const getCategoryCorporation = async (id: string) => {
  try {
    const res = await apiClient.get<CategoryCorporation[]>(
      `/interest-corporation-categories/category/${id}`
    );
    return res.data;
  } catch (err) {
    handleApiError(err, "카테고리별 기업 찾기 실패");
  }
};

export const getCategory = async () => {
  try {
    const res = await apiClient.get<Category[]>(`/categories/my`);
    return res.data;
  } catch (err) {
    handleApiError(err, "카테고리 찾기 실패");
  }
};
