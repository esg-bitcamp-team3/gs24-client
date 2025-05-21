import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Icon,
  Button,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FaChartLine,
  FaNewspaper,
  FaChartPie,
  FaArrowRight,
} from "react-icons/fa";
import ESGWordCloud from "../company/keywordTrend/ESGWordCloud";
import WordCloudExample from "./ESGWordCloud";
import NewsExample from "./NewsExample";

// 샘플 뉴스 데이터
const sampleNewsData = [
  {
    title: "현대차, 전기차 생산 확대로 탄소배출 30% 감축 계획 발표",
    date: "2025-05-15",
    keywords: ["전기차", "탄소중립", "친환경", "지속가능성"],
    sentiment: "positive",
  },
  {
    title: "삼성전자, 협력사 ESG 관리 강화... 공급망 전반 관리 시스템 구축",
    date: "2025-05-12",
    keywords: ["공급망", "협력사", "노동환경", "투명성"],
    sentiment: "neutral",
  },
  {
    title: "SK이노베이션, 배터리 재활용 기술 개발에 1조원 투자",
    date: "2025-05-10",
    keywords: ["배터리", "재활용", "순환경제", "친환경"],
    sentiment: "positive",
  },
];

// 트렌드 키워드 데이터
const trendingKeywords = [
  { keyword: "탄소중립", growth: "+127%", color: "green.500" },
  { keyword: "순환경제", growth: "+82%", color: "blue.500" },
  { keyword: "공급망 투명성", growth: "+65%", color: "purple.500" },
  { keyword: "생물다양성", growth: "+43%", color: "teal.500" },
  { keyword: "수자원 관리", growth: "+38%", color: "cyan.500" },
];

const KeyWordTrendPage = () => {
  const cardBg = "gray.200";
  const highlightColor = "blue.500";

  return (
    <Box
      py={16}
      bgGradient="linear(to-b, blue.50, white)"
      borderRadius="xl"
      maxW="1200px"
      w="100%"
    >
      <VStack gap={2}>
        {/* Header Section */}
        <Box textAlign="center" px={8}>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
            mb={4}
            color={"gray.700"}
            lineHeight="1.2"
          >
            실시간 ESG 키워드 트렌드 분석
          </Heading>
          <Heading
            fontSize={{ base: "2xl", md: "2xl" }}
            fontWeight="500"
            mx="auto"
            color="gray.700"
            mb={10}
            textShadow="0 1px 2px rgba(0,0,0,0.05)"
            lineHeight="1.4"
          >
            기업별{" "}
            <Box as="span" color="blue.500" fontWeight="bold">
              핵심 키워드
            </Box>
            를 발견하고{" "}
            <Box as="span" color="orange.500" fontWeight="bold">
              실시간 뉴스 분석
            </Box>
            으로 트렌드를 파악하세요
          </Heading>
        </Box>

        {/* Word Cloud Showcase */}

        {/* Trending Keywords & News */}
        <Flex direction={{ base: "column", lg: "row" }} w="full" px={6}>
          {/* Trending Keywords */}
          <Box
            bg={"white"}
            p={2}
            h={"auto"}
            shadow="md"
            borderRadius="lg"
            flex="1"
            borderTop="4px solid"
            borderColor="blue.500"
          >
            <HStack align="flex-start" gap={4} px={4} mb={4} mt={4}>
              <Icon as={FaChartLine} boxSize={6} color="blue.500" mt={1} />
              <Text fontSize="lg" fontWeight="bold" mb={1}>
                뉴스 기반 키워드 트렌드
              </Text>
            </HStack>

            <VStack align="stretch" gap={4}>
              <NewsExample />
            </VStack>
          </Box>
        </Flex>

        {/* Feature Highlights */}
        {/* <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          px={6}
          w="full"
        >
          <GridItem
            bg={cardBg}
            p={5}
            shadow="md"
            borderRadius="lg"
            borderTop="3px solid"
            borderColor="blue.400"
          >
            <Icon as={FaChartLine} color="blue.400" boxSize={6} mb={3} />
            <Heading size="sm" mb={2}>
              키워드 트렌드 추적
            </Heading>
            <Text fontSize="sm" color="gray.600">
              시간에 따른 키워드 변화 추이를 분석하여 ESG 이슈의 초기 징후를
              포착합니다.
            </Text>
          </GridItem>

          <GridItem
            bg={cardBg}
            p={5}
            shadow="md"
            borderRadius="lg"
            borderTop="3px solid"
            borderColor="teal.400"
          >
            <Icon as={FaChartPie} color="teal.400" boxSize={6} mb={3} />
            <Heading size="sm" mb={2}>
              기업 간 키워드 비교
            </Heading>
            <Text fontSize="sm" color="gray.600">
              동종 업계 기업들의 ESG 키워드를 비교하여 경쟁사 대비 강점과 약점을
              파악합니다.
            </Text>
          </GridItem>

          <GridItem
            bg={cardBg}
            p={5}
            shadow="md"
            borderRadius="lg"
            borderTop="3px solid"
            borderColor="purple.400"
          >
            <Icon as={FaNewspaper} color="purple.400" boxSize={6} mb={3} />
            <Heading size="sm" mb={2}>
              뉴스 감성 분석
            </Heading>
            <Text fontSize="sm" color="gray.600">
              ESG 관련 뉴스의 긍정/부정 감성을 분석하여 기업 이미지 변화를
              모니터링합니다.
            </Text>
          </GridItem>
        </Grid> */}
      </VStack>
    </Box>
  );
};

export default KeyWordTrendPage;
