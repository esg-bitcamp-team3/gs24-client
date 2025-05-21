import { searchApi } from "@/lib/api/apiclient";
import { Box, Flex, Spinner, Text, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import { FaSyncAlt } from "react-icons/fa";

interface Props {
  orgname: string;
}
const EmotionCard = ({ orgname }: Props) => {
  const [negative, setNegative] = useState<number>(0);
  const [positive, setPositive] = useState<number>(0);
  const [emotion, setEmotion] = useState(true);
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
      console.log("감정 분석 결과:", response.data);
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
        mt={6}
        justifyContent="center"
        alignItems="center"
        minHeight="120px"
        flexDir="column"
        gap={3}
        h={"100%"}
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
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          감정 분석 결과
        </Text>

        <IconButton
          onClick={getEmotion}
          size="sm"
          colorScheme="indigo"
          loading={loading}
          variant={"ghost"}
          aria-label="동기화"
        >
          <FaSyncAlt />
        </IconButton>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" mt={6}>
        {emotion ? (
          <>
            <Flex alignItems="center" gap={6}>
              <Box
                borderRadius={"xl"}
                bg="blue.100"
                p={4}
                justifyContent={"center"}
              >
                <IoMdThumbsUp size={40} color="#3182CE" />
              </Box>
              <Box>
                <Text fontSize="md" color="gray.500">
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
            <Flex alignItems="center" gap={6}>
              <Box
                borderRadius={"xl"}
                bg="blue.100"
                p={4}
                justifyContent={"center"}
              >
                <IoMdThumbsDown size={40} color="#E53E3E" />
              </Box>
              <Box>
                <Text fontSize="md" color="gray.500">
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
        mt={6}
        bg="gray.100"
        height="15px"
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
        <Text fontSize="sm" color="blue.500">
          긍정 {positive}
        </Text>
        <Text fontSize="sm" color="red.500">
          부정 {negative}
        </Text>
      </Flex>
    </Flex>
  );
};

export default EmotionCard;
