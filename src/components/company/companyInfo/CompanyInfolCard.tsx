"use client";

import {
  Box,
  Flex,
  Separator,
  Text,
  Button,
  Icon,
  Skeleton,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import { getCorporationInfo } from "@/lib/api/get";

// import {InfoItem} from '../InfoItem'
import { financeApi } from "@/lib/api/apiclient";
import { CorporationInfo } from "@/lib/api/interfaces/corporation";
import { InfoItem } from "@/components/etcs/InfoItem";
import { FaBuilding, FaChartLine, FaNewspaper } from "react-icons/fa";

const CompanyInfoCard = ({ orgId }: { orgId: string }) => {
  const [corpInfo, setCorpInfo] = useState<CorporationInfo>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCorporationInfo(orgId);
        const corpId = await financeApi.get(
          `/company?&corp_code=${data?.corpCode}`
        );
        console.log("🔥 기업 아이디:", corpId.data);
        setCorpInfo(corpId.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId]);

  // 스타일 상수
  const CARD_STYLES = {
    bg: "white",
    borderRadius: "xl",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    _hover: {
      boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
    },
    overflow: "hidden",
  };

  const HEADING_STYLES = {
    fontSize: "xl",
    fontWeight: "700",
    color: "gray.700",
    letterSpacing: "tight",
    display: "flex",
    alignItems: "center",
    gap: 2,
  };

  return (
    <Flex direction={{ base: "column", md: "column" }} gap={8}>
      {/* Company Information Card */}
      <Box {...CARD_STYLES} p={0} w={{ base: "100%", md: "100%" }}>
        <Box p={6}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
            <InfoItem
              label="법인등록번호"
              value={corpInfo?.jurir_no}
              isLoading={loading}
            />
            <InfoItem
              label="대표자명"
              value={corpInfo?.ceo_nm}
              isLoading={loading}
            />
            <InfoItem
              label="사업자등록번호"
              value={corpInfo?.bizr_no}
              isLoading={loading}
            />
            <InfoItem
              label="영문명"
              value={corpInfo?.corp_name_eng}
              isLoading={loading}
            />
            <InfoItem
              label="설립일"
              value={corpInfo?.est_dt}
              isLoading={loading}
              valueColor={corpInfo?.est_dt ? "blue.500" : undefined}
            />
            <InfoItem
              label="결산월"
              value={corpInfo?.acc_mt ? `${corpInfo.acc_mt}월` : undefined}
              isLoading={loading}
            />
            <InfoItem
              label="전화번호"
              value={corpInfo?.phn_no}
              isLoading={loading}
            />
            <InfoItem
              label="팩스번호"
              value={corpInfo?.fax_no}
              isLoading={loading}
            />
            <InfoItem
              label="홈페이지"
              value={corpInfo?.hm_url}
              href={
                corpInfo?.hm_url && !corpInfo.hm_url.startsWith("http")
                  ? `http://${corpInfo.hm_url}`
                  : corpInfo?.hm_url
              }
              isLoading={loading}
              valueColor="blue.500"
            />
            <InfoItem
              label="주소"
              value={corpInfo?.adres}
              isLoading={loading}
              gridColumn={{ md: "1 / 4" }}
            />
          </SimpleGrid>
        </Box>
      </Box>

      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        {/* 주가 차트 */}
        <Box {...CARD_STYLES} w={{ base: "100%", md: "50%" }}>
          <Box bg="teal.50" p={4} borderBottom="1px" borderColor="teal.100">
            <Text {...HEADING_STYLES}>
              <Icon as={FaChartLine} color="teal.500" />
              주가 차트
            </Text>
          </Box>
          <Box
            p={6}
            minH="300px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {loading ? (
              <Flex direction="column" w="100%" gap={4}>
                <Skeleton height="200px" w="100%" />
                <Skeleton height="20px" w="80%" />
              </Flex>
            ) : (
              <Text color="gray.500" fontSize="md">
                주가 차트 데이터가 준비 중입니다
              </Text>
            )}
          </Box>
        </Box>

        {/* 기업 뉴스 */}
        <Box {...CARD_STYLES} w={{ base: "100%", md: "50%" }}>
          <Box bg="purple.50" p={4} borderBottom="1px" borderColor="purple.100">
            <Text {...HEADING_STYLES}>
              <Icon as={FaNewspaper} color="purple.500" />
              기업 뉴스
            </Text>
          </Box>
          <Box
            p={6}
            minH="300px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {loading ? (
              <Flex direction="column" w="100%" gap={3}>
                <Skeleton height="20px" w="100%" />
                <Skeleton height="20px" w="90%" />
                <Skeleton height="20px" w="95%" />
                <Skeleton height="20px" w="85%" />
                <Skeleton height="20px" w="80%" />
              </Flex>
            ) : (
              <Text color="gray.500" fontSize="md">
                뉴스 데이터가 준비 중입니다
              </Text>
            )}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CompanyInfoCard;
