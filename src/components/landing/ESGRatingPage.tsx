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
  Stat,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaChartLine, FaSearchDollar, FaShieldAlt } from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const mockData = [
  { name: "1월", ESG: 40, 예측: 42, 수익률: 1.2 },
  { name: "2월", ESG: 55, 예측: 58, 수익률: 1.8 },
  { name: "3월", ESG: 60, 예측: 63, 수익률: 2.3 },
  { name: "4월", ESG: 70, 예측: 74, 수익률: 3.1 },
  { name: "5월", ESG: 80, 예측: 82, 수익률: 3.8 },
  { name: "6월", ESG: 95, 예측: 91, 수익률: 4.7 },
];

const ESGRatingPage = () => {
  return (
    <Box
      py={16}
      bgGradient="linear(to-b, gray.50, white)"
      borderRadius="xl"
      maxW="1200px"
      w="100%"
    >
      <VStack gap={12}>
        {/* Header Section - More Investment Focused */}
        <Box textAlign="center" px={8}>
          <Heading
            as="h1"
            fontSize="5xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.500, teal.500)"
            bgClip="text"
            color="gray.700"
            mb={4}
            lineHeight="1.1"
          >
            ESG 성과 예측 & 투자 분석
          </Heading>
          <Heading
            fontSize={{ base: "2xl", md: "2xl" }}
            fontWeight="500"
            maxW="850px"
            mx="auto"
            color="gray.700"
            mb={10}
            textShadow="0 1px 2px rgba(0,0,0,0.05)"
            lineHeight="1.4"
          >
            AI 기반 ESG 분석으로{" "}
            <Box as="span" color="blue.500" fontWeight="bold">
              미래 가치 기업
            </Box>
            을 발굴하고
            <Box as="span" color="teal.500" fontWeight="bold">
              {" "}
              지속 가능한 투자 수익
            </Box>
            을 창출하세요
          </Heading>

          {/* Key Metrics Row */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
            mt={4}
          >
            {/* <Stat 
              bg="white" 
              p={4} 
              shadow="md" 
              borderRadius="lg" 
              textAlign="center"
            >
              <StatLabel fontSize="md">ESG 고성과 기업 평균 수익률</StatLabel>
              <StatNumber fontSize="3xl" color="blue.500">+18.3%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                시장 평균 대비
              </StatHelpText>
            </Stat>
            
            <Stat 
              bg="white" 
              p={4} 
              shadow="md" 
              borderRadius="lg" 
              textAlign="center"
            >
              <StatLabel fontSize="md">예측 정확도</StatLabel>
              <StatNumber fontSize="3xl" color="teal.500">94.7%</StatNumber>
              <StatHelpText>
                지난 12개월 기준
              </StatHelpText>
            </Stat>
            
            <Stat 
              bg="white" 
              p={4} 
              shadow="md" 
              borderRadius="lg" 
              textAlign="center"
            >
              <StatLabel fontSize="md">분석 대상 기업</StatLabel>
              <StatNumber fontSize="3xl" color="gray.700">526</StatNumber>
              <StatHelpText>
                국내 상장사
              </StatHelpText>
            </Stat> */}
          </Grid>
        </Box>

        {/* Main Content - Focus on Investment Insights */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          w="full"
          px={8}
          gap={8}
          align="stretch"
        >
          {/* Chart Section - Enhanced for Investors */}
          <Box
            bg="white"
            p={6}
            shadow="md"
            borderRadius="lg"
            flex="1"
            borderTop="4px solid"
            borderColor="blue.500"
          >
            <Heading size="md" mb={2} color="gray.700">
              ESG 점수 예측
            </Heading>
            <Text fontSize="sm" mb={6} color="gray.500">
              ESG 예측 점수를 통해 기업의 지속 가능성을 평가합니다.
            </Text>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={mockData}
                margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "4px" }} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
                <Line
                  type="monotone"
                  dataKey="ESG"
                  stroke="#3182CE"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="실제 ESG 점수"
                />
                <Line
                  type="monotone"
                  dataKey="예측"
                  stroke="#38B2AC"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="예측 ESG 점수"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Investment Value Proposition */}
          <Box
            bg="white"
            p={6}
            shadow="md"
            borderRadius="lg"
            flex="1"
            borderTop="4px solid"
            borderColor="teal.500"
          >
            <VStack gap={6} align="start">
              <HStack align="flex-start" gap={4}>
                <Icon as={FaChartLine} boxSize={6} color="blue.500" mt={1} />
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={1}>
                    AI 뉴스 기반 ESG 점수 예측
                  </Text>
                  <Text fontSize="md" color="gray.600" lineHeight="1.6">
                    최신 ESG 관련 뉴스와 미디어 데이터를{" "}
                    <Box as="span" fontWeight="medium" color="blue.600">
                      실시간
                    </Box>
                    으로 수집·분석하여 기업의 향후 ESG 점수를 예측합니다.
                  </Text>
                </Box>
              </HStack>
              <HStack align="flex-start" gap={4}>
                <Icon as={FaSearchDollar} boxSize={6} color="teal.500" mt={1} />
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={1}>
                    종합 ESG 분석 대시보드
                  </Text>
                  <Text fontSize="md" color="gray.600" lineHeight="1.6">
                    투자자들이 ESG 점수 변화와 업계 평균을 비교할 수 있는
                    대시보드를 제공합니다. 환경(E), 사회(S), 지배구조(G) 각
                    영역별 점수를 시각화하고,{" "}
                    <Box as="span" fontWeight="medium" color="teal.600">
                      투자 기회와 리스크
                    </Box>
                    를 명확히 파악할 수 있도록 지원합니다.
                  </Text>
                </Box>
              </HStack>

              <HStack align="flex-start" gap={4}>
                <Icon as={FaShieldAlt} boxSize={6} color="purple.500" mt={1} />
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={1}>
                    ESG 기반 리스크 관리
                  </Text>
                  <Text fontSize="md" color="gray.600" lineHeight="1.6">
                    ESG 점수를 활용하여 기업의 잠재적 리스크를 사전에 식별하고
                    <Box as="span" fontWeight="medium" color="purple.600">
                      {" "}
                      지속 가능한 경영 전략
                    </Box>
                    을 수립할 수 있도록 지원합니다. 이를 통해 투자자들은
                    <Box as="span" fontWeight="medium" color="green.600">
                      {" "}
                      장기적인 안정성
                    </Box>
                    을 확보할 수 있습니다.
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ESGRatingPage;
