"use client";
import { getCorporationList } from "@/lib/api/get";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Corporation } from "@/lib/api/interfaces/corporation";
import { FixedSizeList as List } from "react-window";
import { useClickAway } from "react-use";

interface rowProps {
  index: number;
  style: React.CSSProperties;
  data: Corporation[];
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
    searchTerm.trim() === ""
      ? companyList
      : companyList.filter(
          (company) =>
            company.corpName &&
            typeof company.corpName === "string" &&
            company.corpName
              .trim()
              .toLowerCase()
              .includes(searchTerm.trim().toLowerCase())
        );

  const loadCompanies = async () => {
    try {
      const data = await getCorporationList();
      setCompanyList(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  useEffect(() => {
    if (companyList.length === 0) {
      loadCompanies();
    }
    if (isDropdownOpen) {
      setSearchTerm("");
    }
  }, [isDropdownOpen]);

  // 가상화를 위한 row
  const Row = ({ index, style, data }: rowProps) => {
    const company = data[index];
    return (
      <Box
        style={style}
        key={company.id}
        display="flex"
        w="100%"
        px={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="ghost"
          color="gray.700"
          justifyContent="flex-start"
          onClick={() => handleCompanyClick(company.id)}
          w="100%"
          h="40px"
          _hover={{
            bg: "blue.50",
            color: "blue.600",
          }}
          fontSize="sm"
          fontWeight="medium"
          transition="all 0.2s"
        >
          {company.corpName}
        </Button>
      </Box>
    );
  };
  return (
    <Box position="relative" width="100%" ref={ref}>
      <Input
        placeholder="검색"
        pl="2"
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
              itemData={filteredCompanies}
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
