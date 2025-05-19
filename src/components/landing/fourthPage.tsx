import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

const scatterData = [
  { x: 10, y: 65 },
  { x: 20, y: 68 },
  { x: 30, y: 72 },
  { x: 40, y: 76 },
  { x: 50, y: 80 },
];

const FourthPage = () => {
  return (
    <Box w="full" maxW="6xl" px={6}>
      <Heading size="lg" mb={10} textAlign="center">
        ESG 지표 요약 대시보드
      </Heading>
      <Flex wrap="wrap" gap={10} justify="center">
        {/* ScatterChart - 회귀 분석 */}
        <Box
          bg="white"
          p={6}
          shadow="lg"
          borderRadius="2xl"
          flexBasis={{ base: "100%", md: "45%" }}
        >
          <Heading size="md" mb={4}>
            ESG 회귀 분석 결과 (Scatter)
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="x"
                name="탄소 배출량 감소율 (%)"
                unit="%"
              />
              <YAxis type="number" dataKey="y" name="ESG 점수" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="회귀 데이터" data={scatterData} fill="#805AD5" />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>

        {/* 분석 설명 */}
        <Box
          bg="white"
          p={6}
          shadow="lg"
          borderRadius="2xl"
          flexBasis={{ base: "100%", md: "45%" }}
        >
          <Heading size="md" mb={4}>
            ESG 예측 등급 및 회귀 분석
          </Heading>
          <Text color="gray.700">
            선형 회귀 모델을 기반으로 ESG 점수의 주요 결정 요인을 분석한 결과,
            탄소 배출량 감소율과 사회적 책임 지표(SRI)가 점수에 가장 큰 영향을
            미친 것으로 나타났습니다. 회귀 분석의 결정 계수(R²)는{" "}
            <strong>0.87</strong>로 높은 설명력을 보여주며, 향후 ESG 성과 예측에
            유의미한 지표로 활용될 수 있습니다.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default FourthPage;
