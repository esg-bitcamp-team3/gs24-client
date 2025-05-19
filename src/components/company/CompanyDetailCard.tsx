"use client";

import {
  Box,
  DataList,
  Flex,
  Separator,
  Text,
  VStack,
  Badge,
  useDisclosure,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import RealTimeChart from "@/components/company/companyInfo/RealTimeChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import ESGWordCloud from "@/components/company/keywordTrend/ESGWordCloud";
import { EsgRatingResponse } from "@/lib/api/interfaces/esgRating";
import { EsgLineData } from "@/components/chartDataImport";
import { EsgBarData } from "../barChart";
import { CompanyInfo } from "@/lib/api/interfaces/companyinfo";
import { getCompanyInfo, getInterestOrganization } from "@/lib/api/get";
import {
  InterestButtonProps,
  OrganizationInfo,
} from "@/lib/api/interfaces/interestOrganization";

import InterestButton from "../etcs/InterestButton";
import { CloseButton, Portal } from "@chakra-ui/react";
import EmotionCard from "./keywordTrend/emotion";
import OpenDart from "./companyInfo/openDart";

// 가짜 데이터
const mockSummary = [
  "삼성전자는 ESG 측면에서 지속 가능한 경영활동을 강화하고 있으며...",
  "최근 반도체 산업 위기 속에서도 친환경 정책을 유지하고 있습니다.",
  "노사관계와 관련한 이슈가 있었으나 빠르게 개선된 것으로 보입니다.",
];

const keywordNews = [
  "삼성전자, 2분기 실적 발표 앞두고 투자자 기대감 커져",
  "친환경 반도체 공정 도입으로 ESG 평가 상승",
  "국내외 ESG 펀드 삼성전자 비중 확대",
];

const CompanyInfoDetailCard = ({ orgId }: { orgId: string }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [companyinfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [showMore, setShowMore] = useState(false);
  // const [ioCheck, setIoCheck] = useState<Boolean>(false)

  const [btnState, setBtnState] = useState<InterestButtonProps>({
    orgId: orgId || "",
    // interest: false
  });

  // ✅ 여기!
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ciData = await getCompanyInfo(orgId);
        if (ciData) setCompanyInfo(ciData || null);
        else return null;

        const checkId = await getInterestOrganization();

        if (
          checkId?.organizationList.find((org: OrganizationInfo) => {
            return org.organization.id === orgId;
          })
        ) {
          setBtnState({ orgId: orgId });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDateRangeClick = (months: number) => {
    const now = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    setStartDate(formatDate(start));
    setEndDate(formatDate(now));
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "green";
    if (grade.startsWith("B")) return "yellow";
    return "red";
  };

  const ESGGradeBadge = ({ grade }: { grade: string }) => {
    return (
      <Badge
        colorScheme={getGradeColor(grade)}
        fontSize="lg"
        px={4}
        py={1}
        borderRadius="md"
      >
        {grade}
      </Badge>
    );
  };
  const esgGrade = "A";
  function handleWordClick(event: any, word: any): void {
    throw new Error("Function not implemented.");
  }
  const [keywordNews, setKeywordNews] = useState<
    { title: string; link: string }[]
  >([]);
  const [organizationRank, setOrganizationRank] = useState<
    { organizationName: string; esgGrade: string; esgScore: number }[]
  >([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const handleNewsUpdate = (
    newsList: { title: string; link: string }[],
    keyword: string
  ) => {
    console.log("🔥 부모가 받은 뉴스:", newsList, keyword);
    setKeywordNews(newsList);
    setSelectedKeyword(keyword);
  };
  return (
    <Flex flexDirection="column" gap={5}>
      {companyinfo && <EmotionCard orgname={companyinfo?.companyName} />}

      {/* 기업 정보 및 차트 */}
      <Flex flexDirection="row" gap={4} width="full">
        <Box
          p={3}
          borderRadius="lg"
          boxShadow="lg"
          w="md"
          backgroundColor="white"
          position="relative"
        >
          <VStack align="center" px="6" width="full" height="full">
            <Flex w="full" flexDirection="row" justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                {companyinfo?.companyName}{" "}
              </Text>
              <OpenDart orgCode="" />

              <InterestButton {...btnState} />
            </Flex>

            <Separator variant="solid" size="lg" padding={1} w="full" />
            <DataList.Root orientation="horizontal">
              {/* 기업 정보 */}{" "}
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  업종
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.industry}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  임직원수
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.numberOfEmployees}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  기업 구분
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.companyType}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  설립일
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.establishmentDate}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  자본금
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.capital}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  대표자
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.ceoName}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  대졸 초임
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.graduateSalary}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  주요 사업
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.mainBusiness}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  4대 보험 가입 여부
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  {companyinfo?.hasFourInsurances}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="small" fontWeight="bold">
                  홈페이지
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize="small">
                  <a
                    href={companyinfo?.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {companyinfo?.homepage}
                  </a>{" "}
                </DataList.ItemValue>
              </DataList.Item>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "접기" : "더보기"}
              </Button>
            </DataList.Root>

            <Box mt={3} w="full">
              {showMore && (
                <Box
                  position="absolute"
                  top="95%" // 박스 아래쪽에 겹쳐서
                  left={0}
                  mt={-2}
                  zIndex={10}
                  background="white"
                  borderRadius="md"
                  boxShadow="xl"
                  p={10}
                  w="100%"
                >
                  <DataList.Root orientation="horizontal">
                    <DataList.Item>
                      <DataList.ItemLabel fontSize="small" fontWeight="bold">
                        본사 주소
                      </DataList.ItemLabel>
                      <DataList.ItemValue fontSize="small">
                        {companyinfo?.address}
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel fontSize="small" fontWeight="bold">
                        계열사 목록
                      </DataList.ItemLabel>
                      <DataList.ItemValue fontSize="small">
                        {companyinfo?.affiliates?.join(", ")}
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel fontSize="small" fontWeight="bold">
                        매출액
                      </DataList.ItemLabel>
                      <DataList.ItemValue fontSize="small">
                        {companyinfo?.revenue}
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>
                </Box>
              )}
            </Box>
          </VStack>
        </Box>

        <Flex direction="column" gap={4} w={{ base: "100%", lg: "70%" }}>
          <Box p={3} borderRadius="lg" boxShadow="lg" backgroundColor="white">
            <Text fontSize="lg" fontWeight="bold">
              ESG별 점수
            </Text>
            <Separator variant="solid" size="lg" padding={1} w="full" />
            <SimpleGrid columns={3}>
              {orgId && <EsgBarData organizationId={orgId} targetKey="E" />}
              {orgId && <EsgBarData organizationId={orgId} targetKey="S" />}
              {orgId && <EsgBarData organizationId={orgId} targetKey="G" />}
            </SimpleGrid>
            <Separator variant="solid" size="lg" w="full" />
          </Box>

          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            {/* 등급 변화 추이 그래프================================================================== */}

            <Box
              p={3}
              borderRadius="lg"
              boxShadow="lg"
              flex="2"
              backgroundColor="white"
            >
              <Text fontSize="lg" fontWeight="bold">
                ESG 등급 변화추이
              </Text>
              <Box mt={4} width={"full"}>
                {orgId && <EsgLineData organizationId={orgId} />}{" "}
              </Box>
            </Box>

            <Box
              p={3}
              borderRadius="lg"
              boxShadow="lg"
              flex="2"
              backgroundColor="white"
            >
              <Text fontSize="lg" fontWeight="bold">
                주식가격
              </Text>
              <Separator size="lg" w="full" />
              <VStack align="start" mt={2}>
                <main className="p-10">
                  <RealTimeChart />
                </main>
              </VStack>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {/* 키워드 및 뉴스 영역 */}
      <Flex direction={{ base: "column", xl: "row" }} gap={4} width="full">
        <Box
          p={3}
          borderRadius="lg"
          boxShadow="lg"
          w={{ base: "100%", xl: "50%" }}
          backgroundColor="white"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <VStack align="center" px="1" width="1340px" height="full">
            <Text fontSize="lg" fontWeight="bold">
              기업 관련 키워드
            </Text>
            <Box w="600px" h="300px" overflow="hidden">
              <ESGWordCloud
                query={companyinfo?.companyName || ""}
                onNewsUpdate={handleNewsUpdate}
              />
            </Box>
          </VStack>
        </Box>
        <Box
          p={3}
          borderRadius="lg"
          boxShadow="lg"
          w={{ base: "100%", xl: "50%" }}
          backgroundColor="white"
          h="auto"
        >
          <Text fontSize="lg" fontWeight="bold">
            키워드 관련 뉴스 {selectedKeyword && `: ${selectedKeyword}`}
          </Text>
          <Separator size="lg" w="full" />
          <VStack align="start" mt={2}>
            {keywordNews.map((news, idx) => (
              <a
                key={idx}
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "14px",
                  color: "black",
                  textDecoration: "underline",
                }}
              >
                • {news.title}
              </a>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CompanyInfoDetailCard;
