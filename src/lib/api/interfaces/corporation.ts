export interface CorporationInfo {
  corp_code: string; // 고유번호
  corp_name: string; // 정식회사명칭
  corp_name_eng: string; // 영문정식회사명칭
  stock_name: string; // 종목명(상장사) 또는 약식명칭(기타법인)
  stock_code: string; // 상장회사의 종목코드(6자리)
  ceo_nm: string; // 대표자명
  // corp_cls: "Y" | "K" | "N" | "E"; // 법인구분 (유가, 코스닥, 코넥스, 기타)
  jurir_no: string; // 법인등록번호
  bizr_no: string; // 사업자등록번호
  adres: string; // 주소
  hm_url: string; // 홈페이지
  ir_url: string; // IR홈페이지
  phn_no: string; // 전화번호
  fax_no: string; // 팩스번호
  induty_code: string; // 업종코드
  est_dt: string; // 설립일 (YYYYMMDD)
  acc_mt: string; // 결산월 (MM)
}

export interface Corporation {
  id: string;
  corpCode: string;
  corpName: string;
  stockCode: string;
}

export interface CorpWithInterest {
  corporation: Corporation;
  interested: boolean;
}

export interface CorporationsWithInterestPage {
  corpWithInterestDTOList: CorpWithInterest[];
  hasMore: boolean;
}

export interface InterestCorporation {
  id: string;
  userId: string;
  corporationId: string;
  checkTime: string;
}

export interface InterestCorporationDetail {
  id: string;
  userId: string;
  corporation: Corporation;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface CategoryCorporation {
  id: string;
  interestCorporationDetailDTO: InterestCorporationDetail;
  categoryDTO: Category;
}
