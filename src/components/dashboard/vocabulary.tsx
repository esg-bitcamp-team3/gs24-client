"use client";
import CHO_HANGUL from "@/lib/data/esgTermJson/CHO_HANGUL.json";
import allTags from "@/lib/data/esgTermJson/allTags.json";
import consonants from "@/lib/data/esgTermJson/consonants.json";

import { EsgTerm } from "@/lib/api/interfaces/esgTerms";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

// 초성별로 분류하기위해서 정의 함

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
    return matchesConsonant && matchesTags;
  });

  const pagedTerms = filteredTerms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="flex-start"
      justify="center"
      wrap="wrap"
      gap={4}
      mt={6}
      w="100%"
    >
      {/* 좌측 카테고리 필터 */}
      <Box
        w={{ base: "100%", md: "240px" }}
        bg="blue.50"
        p={4}
        borderRadius="md"
        flexShrink={0}
      >
        <h4>ESG 용어</h4>
        <VStack align="start">
          <Text mb={2}>주제 카테고리</Text>
          {allTags.map((tag) => (
            <Checkbox.Root
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={() => handleCategoryToggle(tag)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>{tag}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </VStack>
      </Box>

      {/* 우측 본문 */}
      <Box flex="1" p={4}>
        {/* 자모 탭 */}
        <HStack overflowX="auto" gap={2} mb={4}>
          <Button onClick={() => setSelectedConsonant("전체")} variant="solid">
            전체
          </Button>
          {consonants.map((c) => (
            <Button
              key={c}
              size="sm"
              onClick={() => setSelectedConsonant(c)}
              variant={selectedConsonant === c ? "solid" : "outline"}
            >
              {c}
            </Button>
          ))}
        </HStack>

        {/* 표 형태 목록 */}
        <VStack align="stretch" gap={2}>
          {pagedTerms.map((term, index) => (
            <Flex
              key={index}
              justify="space-between"
              bg="gray.50"
              p={3}
              borderRadius="md"
              border="1px solid #eee"
            >
              <Box>
                <Text fontWeight="bold">{term.term}</Text>
                <Text fontSize="sm" color="gray.500">
                  {term.english}
                </Text>
                <HStack mt={2} gap={3}>
                  {term.tags.map((tag) => (
                    <Text key={tag} fontSize="sm" color="teal.600">
                      {tag}
                    </Text>
                  ))}
                </HStack>
              </Box>
            </Flex>
          ))}
        </VStack>

        {/* 페이지네이션 */}
        <HStack justify="center" mt={6}>
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
                  onClick={() => setCurrentPage(pageNumber)}
                  variant={currentPage === pageNumber ? "solid" : "outline"}
                >
                  {pageNumber}
                </Button>
              );
            });
          })()}
        </HStack>
      </Box>
    </Flex>
  );
}
