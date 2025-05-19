"use client";

import { Box, Flex, Separator, Text, Button } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import { getCorporationInfo } from "@/lib/api/get";

// import {InfoItem} from '../InfoItem'
import { financeApi } from "@/lib/api/apiclient";
import { CorporationInfo } from "@/lib/api/interfaces/corporation";
import { InfoItem } from "@/components/etcs/InfoItem";

const CompanyInfoCard = ({ orgId }: { orgId: string }) => {
  const [corpInfo, setCorpInfo] = useState<CorporationInfo>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCorporationInfo(orgId);

        const corpId = await financeApi.get(
          `/company?&corp_code=${data?.corpCode}`
        );
        console.log("🔥 기업 아이디:", corpId.data);
        setCorpInfo(corpId.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
    <Flex direction={{ base: "column", md: "column" }} gap={8}>
      {/* <Flex align="center" ml={4} gap={2}>
        <Separator orientation="vertical" height="1.75em" borderWidth="2px" />
        <Text fontSize="3xl" fontWeight="bold">
          {companyinfo?.companyName}
        </Text>
        <InterestButton orgId={orgId} />
      </Flex> */}
      <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "100%" }}>
        <Flex justify={"space-between"}>
          <Flex
            direction="column"
            wrap="wrap-reverse"
            gap={4}
            w={{ base: "100%", md: "50%" }}
          >
            <InfoItem label="기업명" value={corpInfo?.corp_name} />
            <InfoItem label="종목명" value={corpInfo?.stock_name} />
            <InfoItem label="법인등록번호" value={corpInfo?.jurir_no} />
            <InfoItem label="주소" value={corpInfo?.adres} />
            <InfoItem label="전화번호" value={corpInfo?.phn_no} />
            <InfoItem label="설립일" value={corpInfo?.est_dt} />
          </Flex>
          <Flex
            direction="column"
            wrap="wrap-reverse"
            gap={4}
            w={{ base: "100%", md: "50%" }}
          >
            <InfoItem label="영문명" value={corpInfo?.corp_name_eng} />
            <InfoItem label="대표자명" value={corpInfo?.ceo_nm} />
            <InfoItem label="사업자등록번호" value={corpInfo?.bizr_no} />
            <InfoItem
              label="홈페이지"
              value={corpInfo?.hm_url}
              href={corpInfo?.hm_url}
            />
            <InfoItem label="팩스번호" value={corpInfo?.fax_no} />
            <InfoItem label="결산월" value={corpInfo?.acc_mt} />
          </Flex>
        </Flex>
      </Box>

      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        {/* 주가 차트 */}
        <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "50%" }}>
          <Text {...HEADING_STYLES}>주가 차트</Text>
          <Separator mt={2} mb={4} />
          <Box>주가 차트</Box>
        </Box>

        {/* 기업 뉴스 */}
        <Box {...CARD_STYLES} p={6} w={{ base: "100%", md: "50%" }}>
          <Text {...HEADING_STYLES}>기업 뉴스</Text>
          <Separator mt={2} mb={4} />
          <Box>뉴스 리스트</Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CompanyInfoCard;
