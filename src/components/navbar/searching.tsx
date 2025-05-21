"use client";
import { getCorporationList, getCorporationsWithInterest } from "@/lib/api/get";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import InterestButton from "../etcs/InterestButton";
import {
  Corporation,
  CorpWithInterest,
} from "@/lib/api/interfaces/corporation";
import { FixedSizeList as List } from "react-window";
import { checkLogin } from "@/lib/api/auth";
import { useClickAway } from "react-use";

interface rowProps {
  index: number;
  style: React.CSSProperties;
  data: CorpWithInterest[];
}

const Searching = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyList, setCompanyList] = useState<Corporation[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => setIsDropdownOpen(false));

  const handleCompanyClick = (companyId: string) => {
    setIsDropdownOpen(false);
    router.push(`/dashboard/${companyId}/companyInfo`);
  };

  const filteredCompanies =
    searchTerm === ""
      ? companyList
      : companyList.filter((company) =>
          company.corpName
            .trim()
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        );

  const loadCompanies = async () => {
    try {
      const chkLogin = await checkLogin();
      if (chkLogin) {
        const data = await getCorporationList(); // 서버에서 page별 로딩
        setCompanyList(data ?? []);
      } else {
        const data2 = await getCorporationList();
        const withInterestFalse: CorpWithInterest[] = (data2 ?? []).map(
          (corp) => ({
            corporation: corp,
            interested: false,
          })
        );
        setCompanyList(withInterestFalse.map((item) => item.corporation));
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  useEffect(() => {
    if (companyList.length === 0) {
      loadCompanies();
    }
    if (isDropdownOpen) {
      // 다이얼로그 열리면 초기화
      setSearchTerm("");
    }
  }, [isDropdownOpen]);

  // 가상화를 위한 row
  const Row = ({ index, style, data }: rowProps) => {
    const company = data[index];
    return (
      <Box
        style={style}
        key={company.corporation.id}
        display="flex"
        w="90%"
        justifyContent={"space-between"}
      >
        <Button
          paddingLeft={3}
          variant="ghost"
          color="black"
          justifyContent="flex-start"
          onClick={() => handleCompanyClick(company.corporation.id)}
          w="90%"
        >
          {company.corporation.corpName}
        </Button>
        <InterestButton orgId={company.corporation.id} />
      </Box>
    );
  };
  return (
    <Box position="relative" width="100%" ref={ref}>
      <Input
        placeholder="search"
        value={searchTerm}
        onClick={() => setIsDropdownOpen(true)}
        onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
      />
      {isDropdownOpen && (
        <Box
          position="absolute"
          top="100%"
          mt={1}
          width="100%"
          bg="white"
          boxShadow="md"
          borderRadius="md"
          zIndex={10}
        >
          {filteredCompanies.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={2}>
              No companies found.
            </Text>
          ) : (
            <List
              height={300}
              itemCount={filteredCompanies.length}
              itemSize={50}
              width="100%"
            >
              {Row}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Searching;
