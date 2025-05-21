import { searchApi } from "@/lib/api/apiclient";
import {
  Badge,
  Box,
  Center,
  Flex,
  Icon,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuClock3, LuExternalLink } from "react-icons/lu";

export interface NewsItem {
  title: string;
  originalLink: string;
  link: string;
  description: string;
  pubDate: string;
}

export default function KeywordNews({
  query,
  keyword,
}: {
  query: string;
  keyword?: string;
}) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKeywordNews = async (query: string, keyword?: string) => {
    try {
      const response = await searchApi.get(
        `/keyword-news?query=${encodeURIComponent(
          query || ""
        )}&keyword=${encodeURIComponent(keyword || "")}`
      );

      const data = await response.data;

      return data.map((item: any) => ({
        ...item,
        title:
          item.title
            ?.replace(/&quot;/g, '"')
            ?.replace(/&#39;/g, "'")
            ?.replace(/&lt;/g, "<")
            ?.replace(/&gt;/g, ">")
            ?.replace(/<[^>]+>/g, "")
            ?.trim() || "제목 없음",
        description:
          item.description
            ?.replace(/&quot;/g, '"')
            ?.replace(/&#39;/g, "'")
            ?.replace(/&lt;/g, "<")
            ?.replace(/&gt;/g, ">")
            ?.replace(/<[^>]+>/g, "")
            ?.trim() || "",
      }));
    } catch (error) {
      console.error("❌ 뉴스 로딩 실패:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const newsData = await fetchKeywordNews(query, keyword);

        setNews(newsData);
      } catch (err) {
        console.error("❌ 데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [keyword, query]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Center py={6}>
        <VStack gap={3}>
          <Spinner size="md" color="teal.500" borderWidth={"4px"} />
          <Text fontSize="sm" color="gray.600">
            뉴스를 불러오는 중입니다. 잠시만 기다려주세요
          </Text>
        </VStack>
      </Center>
    );
  }

  if (!news.length) {
    return (
      <Center py={6}>
        <Text color="gray.500">뉴스 데이터가 없습니다.</Text>
      </Center>
    );
  }

  return (
    <Box maxH="400px" overflowY="auto" mt={4}>
      <VStack align="stretch" gap={3} pb={6}>
        {news.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: "none" }}
          >
            <Box
              p={3}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.2s"
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
                  maxLines={2}
                >
                  {item.title}
                </Text>

                {item.description && (
                  <Text fontSize="xs" color="gray.600" maxLines={1}>
                    {item.description}
                  </Text>
                )}

                <Flex justifyContent="space-between" alignItems="center">
                  {item.pubDate && (
                    <Flex alignItems="center" gap={1}>
                      <Icon size={"xs"} color="gray.500">
                        <LuClock3 size={"xs"} color={"gray.500"} />
                      </Icon>
                      <Text fontSize="xs" color="gray.500">
                        {formatDate(item.pubDate)}
                      </Text>
                    </Flex>
                  )}

                  <Flex alignItems="center" gap={1}>
                    <Badge
                      size="sm"
                      colorScheme="teal"
                      variant="subtle"
                      fontSize="10px"
                      px={2}
                    >
                      {keyword || query}
                    </Badge>
                    <Icon size={"xs"} color="gray.500">
                      <LuExternalLink />
                    </Icon>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
