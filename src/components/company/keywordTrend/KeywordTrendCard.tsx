"use client";

import { Box, Flex, Separator, Text, Center } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import ESGWordCloud from "@/components/company/keywordTrend/ESGWordCloud";

import EmotionCard from "./emotion";
import { Tooltip } from "../../ui/tooltip";
import { LuInfo } from "react-icons/lu";
import KeywordNews from "./KeywordNews";
import { financeApi } from "@/lib/api/apiclient";
import { CorporationInfo } from "@/lib/api/interfaces/corporation";
import { getCorporationInfo } from "@/lib/api/get";

const KeywordTrendCard = ({ orgId }: { orgId: string }) => {
  const [corporation, setCorporation] = useState<CorporationInfo>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCorporationInfo(orgId);
        const response = await financeApi.get(
          `company?corp_code=${data?.corpCode}`
        );
        console.log("기업 정보:", response.data);
        setCorporation(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [keywordNews, setKeywordNews] = useState<
    { title: string; link: string }[]
  >([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");

  const handleNewsUpdate = (
    newsList: { title: string; link: string }[],
    keyword: string
  ) => {
    console.log("🔥 부모가 받은 뉴스:", newsList, keyword);
    setKeywordNews(newsList);
    setSelectedKeyword(keyword);
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
  };

  // 스타일 상수
  const CARD_STYLES = {
    bg: "white",
    borderRadius: "xl",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.2s",
    // _hover: {
    //   transform: 'translateY(-2px)',
    //   boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)'
    // },
    overflow: "auto",
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
      {/* 긍정 부정 ================================================================== */}
      <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "30%" }}>
        {corporation?.corp_name && (
          <EmotionCard orgname={corporation?.corp_name} />
        )}
      </Box>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        {/* 관련 키워드 ================================================================== */}
        <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "60%" }}>
          <Flex justify={"center"} align={"center"} mb={4} gap={4}>
            <Text {...HEADING_STYLES} textAlign="center">
              기업 관련 키워드
            </Text>
            <Tooltip
              content="키워드를 클릭하면 관련 뉴스를 볼 수 있습니다"
              positioning={{ placement: "bottom" }}
              openDelay={10}
              closeDelay={100}
            >
              <LuInfo color="gray.400" />
            </Tooltip>
          </Flex>
          <Center>
            <Box w="600px" h="300px">
              <ESGWordCloud
                query={corporation?.corp_name || ""}
                onWordClick={handleKeywordClick}
              />
            </Box>
          </Center>
        </Box>

        {/* 키워드 관련 뉴스 ================================================================== */}
        {/* 뉴스 섹션 */}
        <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "40%" }}>
          <Text {...HEADING_STYLES} textAlign="center" mb={4}>
            키워드 관련 뉴스
            {selectedKeyword && (
              <Text as="span" color="teal.500" ml={2}>
                : {selectedKeyword}
              </Text>
            )}
          </Text>
          <Separator mb={4} />
          <KeywordNews
            query={corporation?.corp_name || ""}
            keyword={selectedKeyword}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default KeywordTrendCard;
