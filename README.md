# ESG 등급 예상 투자 대시보드


### 개요
ESG(환경, 사회, 지배구조) 관점에서 기업의 지속가능성과 비재무적 리스크를 직관적으로 파악할 수 있도록 지원하는 ESG 분석 플랫폼입니다.
국내 뉴스 데이터를 수집·전처리한 뒤, 한국어 뉴스에 특화된 자연어처리 모델 KoElectra를 활용해 ESG 관련 이슈를 자동 식별하고, 감성 분석을 통해 긍정·부정·중립 흐름을 정량화합니다.
투자자는 기업의 재무정보, 주가 데이터, ESG 점수와 함께 주요 이슈를 한눈에 확인할 수 있으며, 재무적 요소뿐 아니라 비재무적 요소를 반영한 종합적인 투자 판단이 가능합니다.

### 기술 스택
- **백엔드:** Spring, Spring Boot, Mongo DB, Django
- **프론트엔드:** Next.js
- **데이터 분석 및 관리:** D3.js, django, naver openAPI, dart, 한국투자증권
- **데이터 분석 및 점수 예측:** KoElectra, Selenium, Pytorch 


### 주요 기능
- **기업 데이터 대시보드:** 기업별 주요 데이터를 시각화해 직관적으로 인사이트 도출 가능
- **기업 감정 분석:** Naver 뉴스, 블로그, 카페 데이터를 기반으로 긍·부정 비율을 시각화
- **ESG 등급 예측:** 최신 ESG 데이터와 뉴스 분석을 통해 기업의 향후 ESG 등급을 예측
- **기업 검색:** 키워드를 통해 원하는 기업을 빠르게 검색 가능
- **관심 기업 관리:** 관심 있는 기업을 그룹화하고 목록으로 관리 가능


### 프로젝트 구조



<img width="661" height="471" alt="image" src="https://github.com/user-attachments/assets/f85a1567-e391-40e6-bf09-6ca40ac2df7e" />


### ESG 점수 예측 시스템 시퀀스 다이어그램



<img width="892" height="692" alt="image" src="https://github.com/user-attachments/assets/896bfe45-ca42-4c44-b763-68845a6485d0" />


### 페이지 상세 설명
1. **랜딩 페이지**

   ![Image](https://github.com/user-attachments/assets/86a8eaa2-fd21-4c09-9236-82da983593b4)

- 기업 검색으로 기업 상세 페이지로 이동 할 수 있습니다.
   
   ![Image](https://github.com/user-attachments/assets/fb97eb50-a93d-46db-bb20-732484af9914) 

2. **로그인 및 회원가입 페이지**
- 로그인 및 회원가입 페이지입니다.

<div class="img-row">
  <img src="https://github.com/user-attachments/assets/794ad0e0-135c-4463-b7ce-16128ef1976f">
  <img src="https://github.com/user-attachments/assets/c6fd5884-48c1-432b-a7b2-2a4ec19bf158">
</div>
   
   필수 정보를 기입하면 회원가입 할 수 있습니다.

3. **기업 대시보드 페이지**
   
- 기업별 데이터와 정보 제공
   
   ![Image](https://github.com/user-attachments/assets/45fcdd81-e093-4aeb-9951-85316a0c3da6)

- 관심 기업 추가 및 해제 가능
- 한국투자증권 API로 최근 한 달간 주가 동향 제공
- 최신 뉴스 목록 제공

   ![Image](https://github.com/user-attachments/assets/d1d5f408-10a4-4368-bc8f-1a34f32dd2bd)
   
- DART를 통한 재무제표 조회


4. **ESG 분석 페이지**
- ESG 별 현재 등급과 연도별 등급 변화 시각화
   
   ![Image](https://github.com/user-attachments/assets/d04af1cd-8566-4d0d-860d-527c63a02f59)

- 기업의 현재 등급과 연도별 등급 변화 추이를 보여줍니다.
- 최신 뉴스 데이터를 기반으로 다음 ESG 예상 등급을 예측해 보여줍니다.

5. **키워드 트렌드 페이지**

   ![Image](https://github.com/user-attachments/assets/421bad39-acbf-4de1-966f-c3828cde9fc1)
   
- 최신 뉴스, 블로그, 카페 글들을 수집하여 감정 분석 비율을 보여쥽니다.
- 기간 별 기업 언급량 추이를 시각화 합니다.

   ![Image](https://github.com/user-attachments/assets/dfaa22da-4c59-40aa-8502-8fa01e56d2a0)

- 키워드 클라우드 및 관련 뉴스 제공 합니다.

6. **용어 사전**

   ![Image](https://github.com/user-attachments/assets/7a52ad37-dbbc-4ee4-bcac-24f4aed44bf8)
   
- ESG 관련 용어 사전 제공, 관련 주제로 필터링 하는 기능 제공합니다.

7. **마이페이지**

   ![Image](https://github.com/user-attachments/assets/0061c147-90a5-4285-b25e-bdf3fd935f73)

- 개인정보, 비밀번호 를 변경 할 수 있습니다.

8. **네비게이션바**

   ![Image](https://github.com/user-attachments/assets/7a83ceb0-e02c-4a36-a61c-9af1b4cb869f)

- 전일 원 달러 환율과 탄소배출권 시세를 제공 합니다.
- 주요 메뉴 바로가기 (기업 검색, 관심기업, 용어사전, 로그인/로그아웃, 마이페이지) 기능이 있습니다.

9. **관심기업 페이지**

   ![Image](https://github.com/user-attachments/assets/7d6684d4-22ee-4406-9527-a5032152c199)

- 내가 선택한 관심 기업을 한눈에 관리합니다.
   
- 카테고리별 관심 기업 분류 및 관리 가능합니다.
   
   ![Image](https://github.com/user-attachments/assets/9fea6f34-44c6-4ad0-857b-1738d679bc9d)

- 관심기업 페이지에서 관심기업 추가 기능입니다.

   ![Image](https://github.com/user-attachments/assets/73e5f9a9-abfe-4040-a1fb-b05c1cce45ef)

- 기업 대시보드 페이지에서 관심기업 추가 기능입니다.


### 프로젝트 특징
- **AI 기반 ESG 예측:** KoElectra 모델을 통한 뉴스 감정 분석으로 ESG 등급 자동 예측
- **실시간 데이터 반영:** DART, 한국투자증권, Naver OpenAPI 등을 통한 최신 데이터 수집 및 분석
- **시각화 중심의 UI/UX:** ESG 등급, 감정 분석, 키워드 트렌드를 직관적으로 확인 가능
- **다양한 데이터 소스 통합:** 뉴스, 블로그, 카페, 공시정보, 주가 데이터까지 통합 관리
- **맞춤형 관심기업 관리:** 카테고리별로 기업을 나누어 관리할 수 있어 투자 포트폴리오 구성에 유리
- **지속 가능성 투자 지원:** 재무 지표뿐만 아니라 비재무적 ESG 리스크와 가치까지 종합적으로 평가
