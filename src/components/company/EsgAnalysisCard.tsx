"use client";

import {
  Box,
  DataList,
  Flex,
  Separator,
  Text,
  VStack,
  Button,
  Icon,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import { EsgLineData } from "@/components/chartDataImport";
import { EsgBarData } from "../barChart";
import { FaClipboardList } from "react-icons/fa";
import EsgPredict from "./ESGPredict";

const EsgAnalysisCard = ({ orgId }: { orgId: string }) => {
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
    <Flex
      direction={{ base: "column", md: "column" }}
      gap={8}
      overflow={"auto"}
    >
      {/* ESG별 점수 막대 그래프 ================================================================== */}
      <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "100%" }}>
        <Text {...HEADING_STYLES} textAlign="center">
          ESG 점수
        </Text>
        <Box
          {...BOX_STYLES}
          w={{ base: "100%", md: "100%" }}
          mt={6}
          p={4}
          gap={4}
        >
          <Flex display="flex" justify="space-between" w={"100%"} gap={4}>
            <Flex direction="column" flex={1} align="center">
              <Text
                mb={2}
                color={ESG_COLORS.E}
                fontWeight="600"
                fontSize="md"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box
                  as="span"
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={ESG_COLORS.E}
                  mr={1}
                />
                환경 (E)
              </Text>
              {orgId && <EsgBarData organizationId={orgId} targetKey="E" />}
            </Flex>
            <Flex direction="column" flex={1} align="center">
              <Text
                mb={2}
                color={ESG_COLORS.S}
                fontWeight="600"
                fontSize="md"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box
                  as="span"
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={ESG_COLORS.S}
                  mr={1}
                />
                사회 (S)
              </Text>
              {orgId && <EsgBarData organizationId={orgId} targetKey="S" />}
            </Flex>
            <Flex direction="column" flex={1} align="center">
              <Text
                mb={2}
                color={ESG_COLORS.G}
                fontWeight="600"
                fontSize="md"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box
                  as="span"
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={ESG_COLORS.G}
                  mr={1}
                />
                지배구조 (G)
              </Text>
              {orgId && <EsgBarData organizationId={orgId} targetKey="G" />}
            </Flex>
          </Flex>
        </Box>
      </Box>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        {/* ESG 등급 변화 추이 선 그래프 ================================================================== */}
        <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "70%" }}>
          <Text {...HEADING_STYLES} textAlign="center">
            ESG 등급 변화 추이
          </Text>
          <Box mt={8} width={"full"}>
            {orgId && <EsgLineData organizationId={orgId} />}
          </Box>
        </Box>

        {/* ESG 예상 등급 ================================================================== */}
        <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "30%" }}>
          <Text {...HEADING_STYLES} textAlign={"center"}>
            ESG 예상 등급
          </Text>

          <EsgPredict orgId={orgId} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default EsgAnalysisCard;
