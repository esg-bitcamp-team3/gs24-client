// pages/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Box, Flex, useBreakpointValue } from "@chakra-ui/react";

import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

import FirstPage from "@/components/landing/firstPage";
import SecondPage from "@/components/landing/secondPage";
import ThirdPage from "@/components/landing/thirdPage";
import FourthPage from "@/components/landing/fourthPage";

const MotionBox = motion(Box);

const sectionVariants: Variants = {
  hidden: (direction: "up" | "down") => ({
    opacity: 0,
    y: direction === "down" ? 50 : -50,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

interface SectionProps {
  children: React.ReactNode;
  id?: string;
}

import { useRef } from "react";
import { useRouter } from "next/navigation";

function FullSection({ children, id }: SectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.8,
    triggerOnce: false,
  });

  const [direction, setDirection] = useState<"up" | "down">("down");
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setDirection(currentScrollY > prevScrollY.current ? "down" : "up");
      prevScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MotionBox
      id={id}
      ref={ref}
      as="section"
      scrollSnapAlign="start"
      // height="full"
      minH="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      custom={direction}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </MotionBox>
  );
}

export default function Home() {
  const [login, setLogin] = useState<boolean>(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [activeSection, setActiveSection] = useState("first-landing");
  const router = useRouter();

  // useEffect(() => {
  //   const fetchLoginStatus = async () => {
  //     const status = await checkLogin()
  //     setLogin(status)
  //   }
  //   fetchLoginStatus()
  // }, [])
  // // 다음 섹션으로 스크롤
  // const scrollToNext = () => {
  //   document.getElementById('section-1')?.scrollIntoView({behavior: 'smooth'})
  // }

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "first-landing",
        "second-landing",
        "third-landing",
        "fourth-landing",
      ];

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveSection(sectionId);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Box
        onClick={() => router.push("/login")}
        // border={"4px solid #000000"}
        fontWeight={"bold"}
        borderRadius="4xl"
        bg={"white"}
        padding={4}
        margin={8}
        position="absolute"
        // top="20px" // 원하는 만큼 margin
        right="20px"
        cursor="pointer"
        zIndex={1000} // 다른 요소 위에 오도록
      >
        Login
      </Box>
      <Box
        height="100vh"
        overflowY="scroll"
        scrollSnapType="y mandatory"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollBehavior: "smooth",
        }}
      >
        {/* 페이지 인디케이터 */}
        <Flex
          direction="column"
          position="fixed"
          top="50%"
          right="40px"
          transform="translateY(-50%)"
          zIndex="overlay"
          gap={3}
        >
          {[
            "first-landing",
            "second-landing",
            "third-landing",
            "fourth-landing",
          ].map((sectionId, idx) => (
            <Box
              key={idx}
              w="10px"
              h="10px"
              borderRadius="full"
              bg="gray.400"
              _hover={{ bg: "gray.600" }}
              cursor="pointer"
              transition="background-color 0.6s"
              onClick={() =>
                document
                  .getElementById(sectionId)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          ))}
        </Flex>
        {/* 1️⃣ Hero Section ================================ */}
        <FullSection id="first-landing">
          <FirstPage />
        </FullSection>

        {/* 2️⃣ ESG 데이터 분석 (대시보드 형태) ============================ */}
        <FullSection id="second-landing">
          <SecondPage />
        </FullSection>

        {/* 3️⃣ 점수예측 ============================ */}
        <FullSection id="third-landing">
          <ThirdPage />
        </FullSection>

        {/* 4️⃣ 키워드 ============================ */}
        <FullSection id="fourth-landing">
          <FourthPage />
        </FullSection>
      </Box>
    </>
  );
}
