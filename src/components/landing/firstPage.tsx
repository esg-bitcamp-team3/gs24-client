import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const MotionBox = motion(Box);

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.6 },
  },
};

interface SectionProps {
  children: React.ReactNode;
  id?: string;
}

function FullSection({ children, id }: SectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  return (
    <MotionBox
      id={id}
      ref={ref}
      as="section"
      scrollSnapAlign="start"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "exit"}
    >
      {children}
    </MotionBox>
  );
}

const FirstPage = () => {
  const [login, setLogin] = useState<boolean>(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      height="100vh"
      overflowY="scroll"
      scrollSnapType="y mandatory"
      css={{
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/* 1️⃣ Hero Section ================================*/}
      <FullSection>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          py={24}
          px={8}
          bgGradient="linear(to-b, purple.50, white)"
          borderRadius="3xl"
          maxW="1200px"
          w="100%"
          gap={12}
        >
          <Box flex={1} maxW="lg">
            <Heading size="5xl" fontWeight="bold">
              ESG 혁신을 위한
              <br /> 새로운 시작
            </Heading>
            <Text fontSize="lg" mt={4} color="gray.600">
              당신의 투자, ESG 데이터로 더 스마트하게!
              <br />
              수천 개의 뉴스 데이터를 분석해 기업의 ESG 흐름을 빠르게
              파악하세요.
            </Text>
            <Box width="100%" display="flex" justifyContent="center">
              <Link href={login ? "/dashboard" : "/login"} passHref>
                <Button
                  mt={6}
                  colorScheme="purple"
                  size="lg"
                  borderRadius="full"
                  w="300px"
                >
                  {" "}
                  {/* 고정된 너비 설정 */}
                  {login ? "대시보드" : "지금 시작하기"}
                </Button>
              </Link>
            </Box>
          </Box>
          <Box flex={1}>
            <Image
              src="/earth.png"
              alt="지구"
              maxH={{ base: "250px", md: "400px" }}
              mx="auto"
            />
          </Box>
        </Flex>
      </FullSection>
    </Box>
  );
};

export default FirstPage;
