"use client";
import CHO_HANGUL from "@/lib/data/esgTermJson/CHO_HANGUL.json";
import allTags from "@/lib/data/esgTermJson/allTags.json";

import { EsgTerm } from "@/lib/api/interfaces/esgTerms";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const getInitialConsonant = (str: string) => {
  const code = str.charCodeAt(0) - 44032;
  if (code >= 0 && code <= 11171) {
    return CHO_HANGUL[Math.floor(code / 588)];
  }
  return /^[A-Za-z]/.test(str[0]) ? "A-Z" : str[0];
};

export default function VocabularyPage({
  initialTerms,
}: {
  initialTerms: EsgTerm[];
}) {
  const [terms, setTerms] = useState(initialTerms);

  const [selectedConsonant, setSelectedConsonant] = useState("전체");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ 검색 상태

  const itemsPerPage = 6;

  const handleCategoryToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredTerms = terms.filter((term) => {
    const matchesConsonant =
      selectedConsonant === "전체" ||
      getInitialConsonant(term.term) === selectedConsonant;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => term.tags.includes(tag));
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.english.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesConsonant && matchesTags && matchesSearch;
  });

  const pagedTerms = filteredTerms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);

  return (
    <Flex w="100%">
      {/* 고정된 사이드바 */}
      <Box
        position="fixed"
        top="64px"
        left="0"
        h="calc(100vh - 64px)"
        w="260px"
        bg="white"
        p={6}
        borderRight="1px solid #e2e8f0"
        overflowY="auto"
        zIndex={100}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Text
          fontSize="xl"
          fontWeight="extrabold"
          textAlign="center"
          color="gray.700"
        >
          📘 ESG 필터
        </Text>

        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap={2}
          justifyItems="center"
          alignItems="center"
        >
          {allTags.map((tag) => (
            <Checkbox.Root
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={() => handleCategoryToggle(tag)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control display="none" />
              <Checkbox.Label w="100%">
                <Text
                  w="100%"
                  textAlign="center"
                  fontSize="xs"
                  px={2}
                  py={1.5}
                  borderRadius="full"
                  boxShadow="sm"
                  fontWeight="medium"
                  bg={selectedTags.includes(tag) ? "blue.500" : "gray.100"}
                  color={selectedTags.includes(tag) ? "white" : "gray.700"}
                  transition="all 0.2s"
                  _hover={{
                    bg: selectedTags.includes(tag) ? "blue.600" : "gray.200",
                    cursor: "pointer",
                  }}
                >
                  {tag}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          ))}
        </Box>
      </Box>

      {/* 본문 콘텐츠 */}
      <Box pl={{ base: 0, md: "280px" }} flex="1" mt={6} pb="100px">
        {/* ✅ 검색창 추가 */}
        <Box mb={4} px={4}>
          <Input
            placeholder="검색어를 입력하세요 (한글 or 영어)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            borderRadius="md"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
          />
        </Box>

        <VStack align="stretch" gap={3}>
          {pagedTerms.map((term, index) => (
            <Flex
              key={index}
              justify="space-between"
              bg="gray.50"
              p={4}
              borderRadius="lg"
              border="1px solid #e2e8f0"
              _hover={{
                boxShadow: "lg",
                transform: "translateY(-2px)",
                transition: "0.2s",
              }}
            >
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {term.term}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {term.english}
                </Text>
                <HStack mt={3} gap={2}>
                  {term.tags.map((tag) => (
                    <Text
                      key={tag}
                      fontSize="xs"
                      color="white"
                      bg="teal.500"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontWeight="semibold"
                    >
                      {tag}
                    </Text>
                  ))}
                </HStack>
              </Box>
            </Flex>
          ))}
        </VStack>

        {/* 페이지네이션 */}
        <Box
          position="fixed"
          bottom="0"
          left={{ base: "0", md: "280px" }}
          right="0"
          py={3}
          bg="whiteAlpha.900"
          boxShadow="md"
          borderTop="1px solid #e2e8f0"
          zIndex={200}
          display="flex"
          justifyContent="center"
        >
          <HStack gap={2}>
            {(() => {
              const maxButtons = 10;
              let startPage = Math.max(
                1,
                currentPage - Math.floor(maxButtons / 2)
              );
              let endPage = startPage + maxButtons - 1;
              if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxButtons + 1);
              }

              return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const pageNumber = startPage + i;
                return (
                  <Button
                    key={pageNumber}
                    size="sm"
                    variant={currentPage === pageNumber ? "solid" : "outline"}
                    colorScheme="blue"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              });
            })()}
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
}
