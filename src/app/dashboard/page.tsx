'use client'

import {Box, Flex, Separator, Spinner, Text} from '@chakra-ui/react'

import React from 'react'
import {Button} from '@chakra-ui/react'
import Link from 'next/link'

import {
  ExchangeRateChart,
  CarbonItemsChart,
  InterestCopList,
  CorporateRank,
  CorpRankByIndustry
} from '@/components/dashboard'

const terms = [
  {
    term: '가명정보',
    english:
      '가명정보란 개인정보의 일부를 삭제·대체하는 등 개인을 알아볼 수 없도록 처리한 정보이다. 예를 들어 이름 홍길동을 이름 홍○○로 바꾼 것인데, 이는 개인 비식별 조치가 된 익명 개인정보와 식별 가능한 개인정보 사이의 중간 단계로 이해할 수 있다.',
    tags: []
  }
]

export default function Dashboard() {
  // 로그인 체크
  // useLoginCheck()

  return (
    <Flex
      flexDirection={{base: 'column', xl: 'row'}}
      gap={4}
      width="full"
      flexWrap="wrap">
      {/* 기업 정보 및 차트 */}
      <Flex flexDirection="row" gap={4} width="full">
        <CorpRankByIndustry />
        {/* 관심 기업 리스트 */}
        <InterestCopList />
        {/* 환율 섹션 */}
        <ExchangeRateChart />
      </Flex>

      {/* 기업 랭킹 영역 */}
      <Flex flexDirection="row" gap={4} width="full">
        <CorporateRank />
        <Flex flexDirection="column" gap={4} width="full">
          <CarbonItemsChart />
          <Box
            p={3}
            borderRadius="lg"
            boxShadow="lg"
            width="full"
            height="260px"
            backgroundColor="white">
            <Flex justifyContent="space-between">
              <Text fontSize="lg" fontWeight="bold">
                ESG 용어사전
              </Text>
              <Link href="/dashboard/vocabulary">
                <Button variant="ghost">자세히 보기</Button>
              </Link>
            </Flex>
            <Separator size="lg" padding={1} w="full" />
            <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
              {terms.map((item, i) => (
                <div key={i}>
                  <Text fontWeight="bold">{item.term}</Text>
                  <Text>{item.english}</Text>
                </div>
              ))}
            </div>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
