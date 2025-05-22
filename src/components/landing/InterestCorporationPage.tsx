import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdBookmark, MdFolderSpecial, MdNotifications } from "react-icons/md";
import {useRouter} from 'next/navigation'

const InterestCorporationPage = () => {
  const router = useRouter()
  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <Box
      py={16}
      bgGradient="linear(to-b, purple.50, white)"
      borderRadius="xl"
      maxW="1200px"
      w="100%"
    >
      <VStack gap={10}>
        {/* 헤더 섹션 */}
        <Box textAlign="center" px={8}>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
            mb={4}
            color={"gray.700"}
            lineHeight="1.2"
          >
            맞춤형 분석
          </Heading>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            mx="auto"
            color="gray.600"
            mb={10}
          >
            <Box as="span" fontWeight="bold" color="blue.500">
              핵심 기업
            </Box>
            을 즐겨찾기로 등록하고
            <Box as="span" fontWeight="bold" color="teal.500">
              {" "}
              맞춤형 카테고리
            </Box>
            로 분류하여 ESG 인사이트를 효율적으로 관리하세요
          </Text>
        </Box>
      </VStack>

      {/* 주요 특징 영역 */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={10} px={8}>
        <VStack
          bg="white"
          p={6}
          borderRadius="lg"
          shadow="md"
          align="start"
          gap={4}
          borderTop="4px solid"
          borderColor="blue.400"
        >
          <Icon as={MdBookmark} color="blue.400" boxSize={10} />
          <Heading size="md">기업 즐겨찾기</Heading>
          <Text fontSize="sm" color="gray.600">
            주요 모니터링 대상 기업을 즐겨찾기에 추가하여 빠르게 접근하고 분석
            정보를 확인할 수 있습니다. 핵심 기업의 ESG 데이터를 놓치지 않고
            추적하세요.
          </Text>
        </VStack>

        <VStack
          bg="white"
          p={6}
          borderRadius="lg"
          shadow="md"
          align="start"
          gap={4}
          borderTop="4px solid"
          borderColor="teal.400"
        >
          <Icon as={MdFolderSpecial} color="teal.400" boxSize={10} />
          <Heading size="md">맞춤형 카테고리</Heading>
          <Text fontSize="sm" color="gray.600">
            목적별, 산업별, 투자 전략별로 기업을 분류하여 체계적으로 관리할 수
            있습니다. 자유롭게 카테고리를 생성하고 기업을 여러 카테고리에 중복
            할당할 수 있습니다.
          </Text>
        </VStack>

        <VStack
          bg="white"
          p={6}
          borderRadius="lg"
          shadow="md"
          align="start"
          gap={4}
          borderTop="4px solid"
          borderColor="purple.400"
        >
          <Icon as={MdNotifications} color="purple.400" boxSize={10} />
          <Heading size="md">알림 설정</Heading>
          <Text fontSize="sm" color="gray.600">
            관심 기업의 ESG 관련 주요 뉴스, 감성 변화, 키워드 등장 빈도 변화
            등을 알림으로 받아볼 수 있습니다. 중요한 변화를 놓치지 않도록
            합니다.
          </Text>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default InterestCorporationPage;
