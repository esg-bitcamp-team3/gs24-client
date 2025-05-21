import {
  Badge,
  Box,
  Flex,
  Icon,
  Link,
  Text,
  VStack,
  Heading,
  Button,
  HStack,
  EmptyState,
} from "@chakra-ui/react";
import {
  LuClock3,
  LuExternalLink,
  LuFileSearch,
  LuFileWarning,
  LuX,
} from "react-icons/lu";
import React, { useState, useEffect } from "react";
import WordCloudExample from "./ESGWordCloud";

// 뉴스 데이터 타입 정의
interface NewsItem {
  title: string;
  description?: string;
  pubDate: string;
  link: string;
  keywords: string[];
  sentiment: "positive" | "neutral" | "negative";
}

// 샘플 뉴스 데이터
const sampleNewsData: NewsItem[] = [
  {
    title: "현대차, 전기차 생산 확대로 탄소배출 30% 감축 계획 발표",
    description:
      "현대자동차가 전기차 생산 확대를 통해 2030년까지 탄소배출을 30% 감축하는 계획을 발표했다.",
    pubDate: "2025-05-15",
    link: "https://example.com/news/1",
    keywords: ["전기차", "탄소중립", "친환경", "지속가능성"],
    sentiment: "positive",
  },
  {
    title: "삼성전자, 협력사 ESG 관리 강화... 공급망 전반 관리 시스템 구축",
    description:
      "삼성전자가 협력사 ESG 관리를 강화하기 위해 공급망 전반 관리 시스템을 구축했다.",
    pubDate: "2025-05-12",
    link: "https://example.com/news/2",
    keywords: ["공급망", "협력사", "노동환경", "투명성"],
    sentiment: "neutral",
  },
  {
    title: "SK이노베이션, 배터리 재활용 기술 개발에 1조원 투자",
    description:
      "SK이노베이션이 배터리 재활용 기술 개발에 1조원을 투자한다고 밝혔다.",
    pubDate: "2025-05-10",
    link: "https://example.com/news/3",
    keywords: ["배터리", "재활용", "순환경제", "친환경"],
    sentiment: "positive",
  },
  {
    title: "LG에너지솔루션, ESG 경영 강화 위한 지속가능성 위원회 신설",
    description:
      "LG에너지솔루션이 ESG 경영을 강화하기 위한 지속가능성 위원회를 신설했다.",
    pubDate: "2025-05-08",
    link: "https://example.com/news/4",
    keywords: ["위원회", "지속가능성", "경영", "투명성"],
    sentiment: "positive",
  },
  {
    title: "포스코, 수소환원제철 기술 실증 플랜트 가동 시작",
    description:
      "포스코가 탄소배출을 줄이기 위한 수소환원제철 기술 실증 플랜트 가동을 시작했다.",
    pubDate: "2025-05-05",
    link: "https://example.com/news/5",
    keywords: ["수소", "탄소중립", "혁신", "에너지"],
    sentiment: "positive",
  },
  {
    title: "카카오, 데이터센터 신재생 에너지 100% 전환 목표 발표",
    description:
      "카카오가 2030년까지 모든 데이터센터를 신재생 에너지로 100% 전환하겠다는 목표를 발표했다.",
    pubDate: "2025-05-03",
    link: "https://example.com/news/6",
    keywords: ["신재생에너지", "데이터센터", "기후", "에너지"],
    sentiment: "positive",
  },
  {
    title: "네이버, AI 윤리 가이드라인 발표... 책임있는 기술 개발 강조",
    description:
      "네이버가 AI 윤리 가이드라인을 발표하고 책임있는 기술 개발을 강조했다.",
    pubDate: "2025-05-01",
    link: "https://example.com/news/7",
    keywords: ["AI", "윤리", "책임", "투명성"],
    sentiment: "neutral",
  },
  {
    title: "KT, 직원 다양성 확대 위한 포용 정책 발표",
    description: "KT가 직원 다양성을 확대하기 위한 포용 정책을 발표했다.",
    pubDate: "2025-04-28",
    link: "https://example.com/news/8",
    keywords: ["다양성", "형평성", "인재", "조직문화"],
    sentiment: "positive",
  },
];

// 감성 분석 결과에 따른 색상 매핑
const sentimentColorScheme = {
  positive: "green",
  neutral: "blue",
  negative: "red",
};

// 감성 분석 결과에 따른 텍스트 매핑
const sentimentText = {
  positive: "긍정",
  neutral: "중립",
  negative: "부정",
};

const NewsExample = () => {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>(sampleNewsData);

  // 키워드로 뉴스 필터링
  useEffect(() => {
    if (selectedKeyword) {
      const filtered = sampleNewsData.filter((item) =>
        item.keywords.includes(selectedKeyword)
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(sampleNewsData);
    }
  }, [selectedKeyword]);

  // 워드클라우드에서 키워드 선택 처리
  const handleWordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
  };

  // 선택된 키워드 필터 제거
  const clearKeywordFilter = () => {
    setSelectedKeyword(null);
  };

  return (
    <Box>
      <HStack h="50%">
        <Box w="60%">
          {/* 워드클라우드 섹션 */}
          <WordCloudExample query="ESG" onWordClick={handleWordClick} />
        </Box>
        <Box w={"40%"}>
          <Box>
            {filteredNews.length === 0 ? (
              <Flex
                h={"400px"}
                overflowY="auto"
                justifyContent="center"
                alignItems="center"
              >
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <LuFileSearch />
                    </EmptyState.Indicator>
                    <EmptyState.Description>
                      선택한 키워드에 대한 뉴스가 없습니다.
                    </EmptyState.Description>
                  </EmptyState.Content>
                </EmptyState.Root>
              </Flex>
            ) : (
              <Box h={"400px"} overflowY="auto">
                <VStack align="start" gap={3} pb={6} w={"full"}>
                  {filteredNews.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      _hover={{ textDecoration: "none" }}
                      w={"full"}
                    >
                      <Box
                        p={3}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        transition="all 0.2s"
                        w={"full"}
                        _hover={{
                          bg: "gray.50",
                          borderColor: "teal.200",
                          transform: "translateY(-2px)",
                          boxShadow: "sm",
                        }}
                      >
                        <Flex direction="column" gap={2}>
                          <Text
                            fontWeight="medium"
                            fontSize="sm"
                            color="gray.800"
                          >
                            {item.title}
                          </Text>

                          {item.description && (
                            <Text fontSize="xs" color="gray.600" maxLines={1}>
                              {item.description}
                            </Text>
                          )}

                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Flex alignItems="center" gap={1}>
                              <Icon as={LuClock3} size="xs" color="gray.500" />
                              <Text fontSize="xs" color="gray.500">
                                {item.pubDate}
                              </Text>
                            </Flex>

                            <Flex alignItems="center" gap={2}>
                              <Icon
                                as={LuExternalLink}
                                size="xs"
                                color="gray.500"
                              />
                            </Flex>
                          </Flex>

                          {/* 키워드 태그 */}
                          <Flex mt={1} flexWrap="wrap" gap={1}>
                            {item.keywords.map((keyword, kidx) => (
                              <Badge
                                px={2}
                                key={kidx}
                                fontSize="10px"
                                colorScheme={
                                  keyword === selectedKeyword ? "blue" : "gray"
                                }
                                variant={
                                  keyword === selectedKeyword
                                    ? "solid"
                                    : "subtle"
                                }
                                cursor="pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedKeyword(keyword);
                                }}
                              >
                                #{keyword}
                              </Badge>
                            ))}
                          </Flex>
                        </Flex>
                      </Box>
                    </Link>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </Box>
      </HStack>
    </Box>
  );
};

export default NewsExample;
