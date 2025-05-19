import React from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const esgData = [
  { name: "2021 ", ESG: 65, 예측: 63 },
  { name: "2022 ", ESG: 69, 예측: 68 },
  { name: "2023 ", ESG: 73, 예측: 72 },
  { name: "2024", ESG: 85, 예측: 85 },
  { name: "2025 ", ESG: 95, 예측: 95 },
];

const pieData = [
  { name: "긍정", value: 70 },
  { name: "부정", value: 30 },
];

const barData = [
  { name: "E", value: 88 },
  { name: "S", value: 80 },
  { name: "G", value: 77 },
];

const COLORS = ["#38B2AC", "#CBD5E0"];

const ThirdPage = () => {
  return (
    <Box w="full" maxW="6xl" px={6}>
      <Heading
        size={{ base: "md", md: "lg" }}
        mb={{ base: 6, md: 8, lg: 10 }}
        textAlign="center"
        px={4}
      >
        ESG 지표 요약 대시보드
      </Heading>

      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        gap={{ base: 6, md: 8, lg: 10 }}
        w="full"
        px={{ base: 4, md: 6 }}
      >
        {/* ESG 점수 및 예측 */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          shadow="lg"
          borderRadius="xl"
          h={{ base: "350px", md: "400px" }}
        >
          <Heading size={{ base: "sm", md: "md" }} mb={4}>
            ESG 점수 및 예측
          </Heading>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={esgData}
              margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ESG"
                stroke="#ab2222"
                strokeWidth={3}
                name="실제 점수"
              />
              <Line
                type="monotone"
                dataKey="예측"
                stroke="#33479c"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="예측 값"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* ESG 전략 설명 */}
        <Box bg="white" p={{ base: 4, md: 6 }} shadow="lg" borderRadius="xl">
          <Heading size={{ base: "sm", md: "md" }} mb={4}>
            ESG 전략
          </Heading>
          <Text
            color="gray.700"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="tall"
          >
            ESG는 기업의 지속 가능성과 비재무적 성과를 평가하는 핵심 지표로,
            환경(Environment), 사회(Social), 지배구조(Governance)의 세 가지
            축으로 구성됩니다. 효과적인 ESG 전략은 리스크 관리, 기업 평판 향상,
            장기적인 재무 성과 개선에 기여할 수 있습니다.
          </Text>
        </Box>

        {/* 긍정/부정 비율 파이 차트 */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          shadow="lg"
          borderRadius="xl"
          h={{ base: "300px", md: "350px" }}
        >
          <Heading size={{ base: "sm", md: "md" }} mb={4}>
            긍정 부정 비율
          </Heading>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* E•S•G별 점수 바 차트 */}
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          shadow="lg"
          borderRadius="xl"
          // h='300px'
          // h={{base: "column", md: 'row'}}
          h={{ base: "300px", md: "350px" }}
        >
          <Heading size={{ base: "sm", md: "md" }} mb={4}>
            E•S•G별 점수
          </Heading>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ThirdPage;
