import { searchApi } from "@/lib/api/apiclient";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";

interface Props {
  orgname: string;
}
const EmotionCard = ({ orgname }: Props) => {
  const [negative, setNegative] = useState<number>(0);
  const [positive, setPositive] = useState<number>(0);
  const [emotion, setEmotion] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const display: number = 10;

  const getEmotion = async () => {
    try {
      setLoading(true);
      const response = await searchApi.get(
        `/sentiment?query=${orgname}&display=${display}`
      );
      setNegative(response.data.result.negatives);
      setPositive(response.data.result.positives);
      setTotal(response.data.result.negatives + response.data.result.positives);
      setEmotion(
        response.data.result.positives > response.data.result.negatives
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmotion();
  }, [orgname]);

  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <Flex
        p={5}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        justifyContent="center"
        alignItems="center"
        minHeight="120px"
        flexDir="column"
        gap={3}
      >
        <Spinner size="lg" color="blue.500" borderWidth={"4px"} />
        <Text fontSize="sm" color="gray.500">
          감정 분석 중...
        </Text>
      </Flex>
    );
  }

  return (
    <Flex p={5} borderRadius="lg" flexDir="column" width="100%">
      <Text fontWeight="bold" fontSize="lg" mb={3}>
        감정 분석 결과
      </Text>

      <Flex justifyContent="space-between" alignItems="center">
        {emotion ? (
          <>
            <Flex alignItems="center" gap={3}>
              <IoMdThumbsUp size={48} color="#3182CE" />
              <Box>
                <Text fontSize="sm" color="gray.500">
                  긍정적 의견
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {getPercentage(positive)}%
                </Text>
              </Box>
            </Flex>
          </>
        ) : (
          <>
            <Flex alignItems="center" gap={3}>
              <IoMdThumbsDown size={48} color="#E53E3E" />
              <Box>
                <Text fontSize="sm" color="gray.500">
                  부정적 의견
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {getPercentage(negative)}%
                </Text>
              </Box>
            </Flex>
          </>
        )}
      </Flex>

      <Flex
        mt={4}
        bg="gray.100"
        height="10px"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          width={`${getPercentage(positive)}%`}
          bg="blue.500"
          height="100%"
          transition="width 0.5s ease-in-out"
        />
        <Box
          width={`${getPercentage(negative)}%`}
          bg="red.500"
          height="100%"
          transition="width 0.5s ease-in-out"
        />
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        <Text fontSize="xs" color="blue.500">
          긍정 {positive}
        </Text>
        <Text fontSize="xs" color="red.500">
          부정 {negative}
        </Text>
      </Flex>
    </Flex>
  );
};

export default EmotionCard;
