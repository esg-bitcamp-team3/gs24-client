import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Icon,
  Accordion,
} from "@chakra-ui/react";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { useClickAway } from "react-use";
import router from "next/router";

const LandingSearchPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleCompanyClick = (companyId: string) => {
    setIsDropdownOpen(false);
    router.push(`/dashboard/${companyId}/companyInfo`);
  };
  const [searchTerm, setSearchTerm] = useState("");
  interface Company {
    id: string;
    name: string;
  }
  const [searchResults, setSearchResults] = useState<Company[]>([]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // This is a mock data. Replace with actual API call
    const mockResults = [
      { id: "1", name: "삼성전자" },
      { id: "2", name: "네이버" },
      { id: "3", name: "카카오" },
      { id: "4", name: "삼성" },
    ].filter((company) => company.name.includes(value));
    setSearchResults(value ? mockResults : []);
  };

  const ref = React.useRef(null);
  useClickAway(ref, () => {
    setSearchResults([]);
  });
  return (
    <Flex direction="column" width="full" align="center" justify="center">
      <Box textAlign="center" mb="10">
        <Heading as="h1" size="6xl" fontWeight="bold">
          ESG 등급 분석의 시작
        </Heading>
        <Text fontSize="xl" color="gray.600" mt={2}>
          관심 있는 기업을 검색해 ESG 인사이트를 확인해보세요.
        </Text>
      </Box>

      <Flex
        maxW={isInputFocused ? "1200px" : "1000px"} // 클릭 시 더 넓어짐
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
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
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
                {searchResults.map((company, index) => (
                  <Box
                    key={company.id}
                    p={4}
                    _hover={{ bg: "green.50" }}
                    cursor="pointer"
                    onClick={() => handleCompanyClick(company.id)}
                    borderBottom={
                      index < searchResults.length - 1 ? "1px" : "0"
                    }
                    borderColor="gray.100"
                    transition="all 0.2s"
                  >
                    <Flex align="center" justify="space-between">
                      <Text fontSize="md" fontWeight="medium">
                        {company.name}
                      </Text>
                      <Icon as={FaArrowRight} color="gray.400" />
                    </Flex>
                  </Box>
                ))}
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
