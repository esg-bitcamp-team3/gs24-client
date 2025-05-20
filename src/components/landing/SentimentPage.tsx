import React, { useState } from "react";
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
  Select,
  Stat,
} from "@chakra-ui/react";
import {
  FaChartLine,
  FaNewspaper,
  FaChartPie,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import WordCloudExample from "./ESGWordCloud";
import { IoMdThumbsUp } from "react-icons/io";

// 단일 기업의 언급량 추이 샘플 데이터
const mentionTrendData = [
  { date: "1월", 언급량: 145 },
  { date: "2월", 언급량: 182 },
  { date: "3월", 언급량: 222 },
  { date: "4월", 언급량: 200 },
  { date: "5월", 언급량: 189 },
  { date: "6월", 언급량: 210 },
];

// 감성 분석 (정서 분석) 샘플 데이터
const sentimentData = [
  { name: "긍정", value: 62, color: "#38A169" },
  { name: "중립", value: 28, color: "#4299E1" },
  { name: "부정", value: 10, color: "#E53E3E" },
];

// 월별 감성 변화 추이
const sentimentTrendData = [
  { date: "1월", 긍정: 55, 중립: 30, 부정: 15 },
  { date: "2월", 긍정: 58, 중립: 28, 부정: 14 },
  { date: "3월", 긍정: 60, 중립: 29, 부정: 11 },
  { date: "4월", 긍정: 59, 중립: 31, 부정: 10 },
  { date: "5월", 긍정: 61, 중립: 30, 부정: 9 },
  { date: "6월", 긍정: 62, 중립: 28, 부정: 10 },
];

// 기업 샘플 목록
const companyOptions = [
  { value: "samsung", label: "삼성전자" },
  { value: "sk", label: "SK하이닉스" },
  { value: "lg", label: "LG에너지솔루션" },
  { value: "hyundai", label: "현대자동차" },
  { value: "naver", label: "네이버" },
];

const SentimentPage = () => {
  return (
    <Box
      py={16}
      bgGradient="linear(to-b, purple.50, white)"
      borderRadius="xl"
      maxW="1200px"
      w="100%"
    >
      <VStack gap={10}>
        {/* 헤더 섹션 */}
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
            기업 이미지 분석
          </Heading>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            maxW="800px"
            mx="auto"
            color="gray.600"
            mb={6}
          >
            뉴스, 블로그, 카페 데이터를 기반으로{" "}
            <Box as="span" fontWeight="bold" color="purple.500">
              긍정·부정{" "}
            </Box>
            감성 비율과{" "}
            <Box as="span" fontWeight="bold" color="teal.500">
              검색량{" "}
            </Box>
            추이를 분석하여 기업의 ESG 이미지 변화를 시각화합니다.
          </Text>
        </Box>

        {/* 언급량 추이 그래프 */}
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
            borderColor="purple.500"
          >
            <HStack align="flex-start" gap={4} px={4} mb={4} mt={4}>
              <Icon as={FaChartLine} boxSize={6} color="purple.500" mt={1} />
              <VStack align="start" gap={1}>
                <Text fontSize="lg" fontWeight="bold">
                  기업 검색량 추이
                </Text>
                <Text fontSize="md" color="gray.600" lineHeight="1.6">
                  기업의 검색량 변화를 한눈에 확인할 수 있습니다.
                </Text>
              </VStack>
            </HStack>

            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mentionTrendData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="colorMention"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#805AD5" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#805AD5"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#718096" />
                  <YAxis stroke="#718096" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="언급량"
                    stroke="#805AD5"
                    fillOpacity={1}
                    fill="url(#colorMention)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Flex>

        {/* 감성 분석 섹션 */}

        {/* <Flex direction={{ base: "column", lg: "row" }} w="full" px={6} gap={6}>
          <Box bg="white" p={6} shadow="md" borderRadius="lg" flex="1">
            <VStack align="start" mb={4} gap={1}>
              <Heading size="md">ESG 감성 분석</Heading>
              <Text fontSize="sm" color="gray.500">
                모든 매체의 ESG 관련 언급 감성 비율 (긍정/중립/부정)
              </Text>
            </VStack>
            <Flex p={5} borderRadius="lg" flexDir="column" width="100%">
              <Flex justifyContent="space-between" alignItems="center" mt={6}>
                <Flex alignItems="center" gap={6}>
                  <Box
                    borderRadius={"xl"}
                    bg="blue.100"
                    p={4}
                    justifyContent={"center"}
                  >
                    <IoMdThumbsUp size={40} color="#3182CE" />
                  </Box>
                  <Box>
                    <Text fontSize="md" color="gray.500">
                      긍정적 의견
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      67%%
                    </Text>
                  </Box>
                </Flex>
              </Flex>

              <Flex
                mt={6}
                bg="gray.100"
                height="15px"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  width="67%"
                  bg="blue.500"
                  height="100%"
                  transition="width 0.5s ease-in-out"
                />
                <Box
                  width={"33%"}
                  bg="red.500"
                  height="100%"
                  transition="width 0.5s ease-in-out"
                />
              </Flex>

              <Flex justifyContent="space-between" mt={2}>
                <Text fontSize="sm" color="blue.500">
                  긍정 67%
                </Text>
                <Text fontSize="sm" color="red.500">
                  부정 33%
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Flex> */}
      </VStack>
    </Box>
  );
};

export default SentimentPage;
