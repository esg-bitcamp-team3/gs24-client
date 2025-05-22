import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Icon,
} from "@chakra-ui/react";
import { getCorporationList, getCorporationsWithInterest } from "@/lib/api/get";
import { useRouter } from "next/navigation";
import { Corporation } from "@/lib/api/interfaces/corporation";
import { FixedSizeList as List } from "react-window";
import { useClickAway } from "react-use";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import LandingNav from "../navbar/landingNav";

interface rowProps {
  index: number;
  style: React.CSSProperties;
  data: Corporation[];
}

const LandingSearchPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyList, setCompanyList] = useState<Corporation[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setIsDropdownOpen(false);
  });

  const handleCompanyClick = (companyId: string, companyName: string) => {
    setSearchTerm(companyName || ""); // 선택한 회사 이름을 검색창에 설정
    setIsDropdownOpen(false);

    // 300ms 후에 페이지 이동 (검색어가 표시되는 것을 볼 수 있도록)
    setTimeout(() => {
      router.push(`/dashboard/${companyId}/companyInfo`);
    }, 200);
  };

  const safeSearchTerm = (searchTerm || "").trim().toLowerCase();

  // const filteredCompanies =
  //   safeSearchTerm === ""
  //     ? []
  //     : companyList.filter((company) => company.corpName);
  // const filteredCompanies =
  //   searchTerm.trim() === ""
  //     ? []
  //     : companyList.filter((company) =>
  //         company.corpName
  //           .trim()
  //           .toLowerCase()
  //           .includes(searchTerm.trim().toLowerCase())
  //       );
  const filteredCompanies =
    searchTerm.trim() === ""
      ? []
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
      const data = await getCorporationList(); // 서버에서 page별 로딩
      setCompanyList(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  useEffect(() => {
    if (companyList.length === 0) {
      loadCompanies();
    }
    console.log("searchTerm:", searchTerm);
  }, [isDropdownOpen, searchTerm]);

  const Row = ({ index, style, data }: rowProps) => {
    const company = data[index];
    return (
      <Box style={style} key={company.id} display="flex" w="100%" px="5">
        <Button
          variant="ghost"
          color="black"
          justifyContent="flex-start"
          onClick={() => handleCompanyClick(company.id, company.corpName)}
          onMouseDown={(e) => e.preventDefault()}
          w="100%"
          _hover={{ bg: "gray.50" }}
          transition="all 0.2s"
        >
          <Flex align="center" justify="space-between" width="100%">
            <Text fontSize="md" fontWeight="medium">
              {company.corpName}
            </Text>
            <Icon as={FaArrowRight} color="gray.400" />
          </Flex>
        </Button>
      </Box>
    );
  };

  return (
    <Flex direction="column" width="full" align="center" justify="center">
      <LandingNav />
      <Box textAlign="center" mb="10">
        <Heading as="h1" size="6xl" fontWeight="bold">
          ESG 등급 분석의 시작
        </Heading>
        <Text fontSize="xl" color="gray.600" mt={2}>
          관심 있는 기업을 검색해 ESG 인사이트를 확인해보세요.
        </Text>
      </Box>

      <Flex
        maxW={isInputFocused ? "1100px" : "1000px"} // 클릭 시 더 넓어짐
        w="100%"
        h="100%"
        bg="white"
        rounded={isInputFocused ? "2xl" : "full"} // 클릭 시 모서리 변경
        shadow="xl"
        p={3}
        align="center"
        transition="all 0.3s"
        zIndex="1"
        _hover={{ shadow: "2xl", transform: "translateY(-2px)" }}
      >
        <Flex flex={1} align="center" px={8}>
          <Icon as={FaSearch} color="gray.400" mr={4} boxSize={6} />
          <Box width="full" position="relative">
            <Input
              placeholder="회사명을 입력하세요"
              variant="flushed"
              fontSize="xl"
              size="lg"
              width="full"
              _placeholder={{ color: "gray.400" }}
              onFocus={() => {
                setIsInputFocused(true);
                // 검색어가 있을 때만 드롭다운 열기
                if (searchTerm.trim() !== "") {
                  setIsDropdownOpen(true);
                }
              }}
              onBlur={() => {
                setIsInputFocused(false);
              }}
              value={searchTerm}
              // onChange={(e) => {
              //   const newValue = e.target.value;
              //   setSearchTerm(newValue);
              //   // 검색어가 있을 때만 드롭다운 열기
              //   setIsDropdownOpen(newValue.trim() !== "");
              // }}
              onChange={(e) => {
                const newValue = e.target.value || "";
                setSearchTerm(newValue);
                setIsDropdownOpen(newValue.trim() !== "");
              }}
            />
            {isDropdownOpen && filteredCompanies.length > 0 && (
              <Box
                position="absolute"
                top="100%"
                left={0}
                right={0}
                bg="white"
                shadow="lg"
                rounded="xl"
                mt={2}
                zIndex={2}
                ref={ref}
                overflow="hidden"
                border="1px"
                borderColor="gray.100"
              >
                <List
                  height={200}
                  itemCount={filteredCompanies.length}
                  itemSize={50}
                  width="100%"
                  itemData={filteredCompanies}
                >
                  {Row}
                </List>
              </Box>
            )}
          </Box>
        </Flex>

        <Button
          colorScheme="gray"
          size="xl"
          rounded="full"
          px={8}
          py={4}
          fontSize="lg"
          _hover={{
            transform: "translateX(4px)",
          }}
        >
          검색 <Icon as={FaArrowRight} ml={2} boxSize={5} />
        </Button>
      </Flex>
      <Box h={150}></Box>
    </Flex>
  );
};

export default LandingSearchPage;
