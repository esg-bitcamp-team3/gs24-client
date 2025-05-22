"use client";

import { crawlApi, financeApi } from "@/lib/api/apiclient";
import { getCorporationInfo } from "@/lib/api/get";
import { CorporationInfo } from "@/lib/api/interfaces/corporation";
import {
  Box,
  DataList,
  Flex,
  Separator,
  Text,
  VStack,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

interface EsgData {
  company_name: string;
  e_score: number;
  s_score: number;
  g_score: number;
  date: string;
}

const EsgPredict = ({ orgId }: { orgId: string }) => {
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCorporationInfo(orgId);

        setCompanyName(data?.corpName || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId]);

  const [esgData, setEsgData] = useState<EsgData>({
    company_name: "",
    e_score: 0,
    s_score: 0,
    g_score: 0,
    date: "",
  });

  const fetchESGPrediction = async () => {
    try {
      const response = await crawlApi.get<EsgData>(
        `/predict?company_name=${encodeURIComponent(companyName)}`
      );
      setEsgData(
        response.data || {
          company_name: "",
          e_score: 0,
          s_score: 0,
          g_score: 0,
          date: "",
        }
      );
    } catch (error) {
      console.error("Error fetching ESG prediction:", error);
      // Keep default data on error
    }
  };

  // Fetch ESG prediction data
  useEffect(() => {
    fetchESGPrediction();
  }, [companyName]);

  // ESG 점수를 등급으로 변환하는 함수
  const getGrade = (score: number | null): string => {
    if (score === null) return "-";

    switch (score) {
      case 6:
        return "A+";
      case 5:
        return "A";
      case 4:
        return "B+";
      case 3:
        return "B";
      case 2:
        return "C";
      case 1:
        return "D";
      default:
        return "-";
    }
  };

  // 평균 점수 계산 (null 값 처리)
  const calculateAverageScore = (): number | null => {
    const { e_score, s_score, g_score } = esgData;

    // 모든 점수가 0이면 데이터가 없는 것으로 간주
    if (e_score === 0 && s_score === 0 && g_score === 0) {
      return null;
    }

    let validScores = 0;
    let sum = 0;

    if (e_score > 0) {
      sum += e_score;
      validScores++;
    }

    if (s_score > 0) {
      sum += s_score;
      validScores++;
    }

    if (g_score > 0) {
      sum += g_score;
      validScores++;
    }

    return validScores > 0 ? Math.round(sum / validScores) : null;
  };

  // 평균 점수
  const averageScore = calculateAverageScore();

  // 전체 등급
  const overallGrade = getGrade(averageScore);

  // 점수에 따른 진행률 계산 (0% ~ 100%)
  const getProgressPercentage = (score: number | null): string => {
    if (score === null) return "0%";
    return `${(score - 1) * 20}%`; // 1점은 0%, 6점은 100%
  };

  // 스타일 상수
  const CARD_STYLES = {
    bg: "white",
    borderRadius: "xl",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    _hover: {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
    },
    overflow: "hidden",
    border: "1px solid",
    borderColor: "gray.100",
  };

  const BOX_STYLES = {
    bg: "white",
    borderRadius: "xl",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  };

  const ESG_COLORS = {
    E: "green.500",
    S: "purple.500",
    G: "orange.500",
  };

  const HEADING_STYLES = {
    fontSize: "xl",
    fontWeight: "700",
    color: "gray.700",
    letterSpacing: "tight",
  };

  return (
    <Flex mt={8} direction="column" gap={8} overflow={"auto"}>
      <Flex justify="space-between" align="center" mb={4}>
        <IconButton
          onClick={fetchESGPrediction}
          size="sm"
          loading={loading}
          color="gray.500"
          variant={"ghost"}
          aria-label="동기화"
        >
          <FaSyncAlt />
        </IconButton>
      </Flex>

      <Flex direction="column" align="center" justify="center" h="200px">
        <Box position="relative">
          {/* Outer ring with gradient */}
          <Box
            w="140px"
            h="140px"
            borderRadius="full"
            background={
              averageScore
                ? "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)"
                : "linear-gradient(135deg, #CBD5E0 0%, #A0AEC0 100%)"
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={
              averageScore
                ? "0 4px 20px rgba(66, 153, 225, 0.3)"
                : "0 4px 20px rgba(160, 174, 192, 0.3)"
            }
          >
            {/* Inner circle with grade */}
            <Box
              w="120px"
              h="120px"
              borderRadius="full"
              bg="white"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontSize="4xl"
                fontWeight="bold"
                color={averageScore ? "blue.500" : "gray.500"}
                letterSpacing="-1px"
              >
                {overallGrade}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box mt={6} textAlign="center">
          <Text color="gray.600" fontSize="sm">
            예상 등급 ({new Date().getFullYear()}년 {new Date().getMonth() + 1}
            월)
          </Text>
        </Box>

        {/* Mini legend */}
        <Box mt={4} p={2} bg="gray.50" borderRadius="md" w="90%">
          <Flex justifyContent="space-between" fontSize="xs" color="gray.500">
            <Text
              fontWeight={averageScore === 1 ? "bold" : "normal"}
              color={averageScore === 1 ? "blue.500" : "inherit"}
            >
              D
            </Text>
            <Text
              fontWeight={averageScore === 2 ? "bold" : "normal"}
              color={averageScore === 2 ? "blue.500" : "inherit"}
            >
              C
            </Text>
            <Text
              fontWeight={averageScore === 3 ? "bold" : "normal"}
              color={averageScore === 3 ? "blue.500" : "inherit"}
            >
              B
            </Text>
            <Text
              fontWeight={averageScore === 4 ? "bold" : "normal"}
              color={averageScore === 4 ? "blue.500" : "inherit"}
            >
              B+
            </Text>
            <Text
              fontWeight={averageScore === 5 ? "bold" : "normal"}
              color={averageScore === 5 ? "blue.500" : "inherit"}
            >
              A
            </Text>
            <Text
              fontWeight={averageScore === 6 ? "bold" : "normal"}
              color={averageScore === 6 ? "blue.500" : "inherit"}
            >
              A+
            </Text>
          </Flex>
          <Box
            w="100%"
            h="4px"
            bg="gray.200"
            borderRadius="full"
            mt={1}
            position="relative"
          >
            <Box
              position="absolute"
              left="0"
              w={getProgressPercentage(averageScore)}
              h="100%"
              bg="blue.500"
              borderRadius="full"
            />
          </Box>
        </Box>
      </Flex>

      {/* 개별 ESG 점수 표시 */}
      <Box mt={6}>
        <Flex mb={2} justify="space-between">
          <Text fontWeight="medium" color={ESG_COLORS.E}>
            E - 환경
          </Text>
          <Text fontWeight="bold">{getGrade(esgData.e_score)}</Text>
        </Flex>
        <Flex mb={2} justify="space-between">
          <Text fontWeight="medium" color={ESG_COLORS.S}>
            S - 사회
          </Text>
          <Text fontWeight="bold">{getGrade(esgData.s_score)}</Text>
        </Flex>
        <Flex mb={2} justify="space-between">
          <Text fontWeight="medium" color={ESG_COLORS.G}>
            G - 지배구조
          </Text>
          <Text fontWeight="bold">{getGrade(esgData.g_score)}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default EsgPredict;
