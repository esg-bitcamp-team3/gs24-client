"use client";

import InterestButton from "@/components/etcs/InterestButton";
import SideBar from "@/components/sideBar";
import { financeApi } from "@/lib/api/apiclient";
import { getCorporationInfo } from "@/lib/api/get";
import { Corporation, CorporationInfo } from "@/lib/api/interfaces/corporation";
import { Badge, Box, Flex, Icon, Separator, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [companyinfo, setCompanyInfo] = useState<CorporationInfo>();
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getCorporationInfo(id);
        const corpId = await financeApi.get(
          `/company?&corp_code=${data?.corpCode}`
        );
        console.log("🔥 기업 아이디:", corpId.data);
        setCompanyInfo(corpId.data);
      } catch (error) {
        console.error("Error fetching corporation info:", error);
      }
    };
    fetchData();
  }, [id]);

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

  return (
    <>
      <SideBar />
      <Box
        ml={"250px"}
        overflow={"auto"}
        maxW={"full"}
        maxH="full"
      >
        <Box {...CARD_STYLES} p={0} w={{ base: "100%", md: "100%" }}>
          <Box bg="blue.50" p={4} borderBottom="1px" borderColor="blue.100">
            <Flex align="center" gap={3}>
              <Icon as={FaBuilding} boxSize={6} color="blue.500" />
              <Text fontSize="2xl" fontWeight="bold" >
                {companyinfo?.corp_name}
              </Text>
              {/* {companyinfo?.stock_name && (
                <Badge
                  colorScheme="blue"
                  fontSize="sm"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {companyinfo.stock_name}
                </Badge>
              )} */}
              {id && <InterestButton orgId={id} />}
            </Flex>
          </Box>
        </Box>
        {children}
      </Box>
    </>
  );
}
