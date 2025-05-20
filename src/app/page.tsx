"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// 랜딩 페이지 각 섹션 컴포넌트 import
import LandingSearchPage from "@/components/landing/landingSearchPage";
import FirstPage from "@/components/landing/firstPage";
import SecondPage from "@/components/landing/secondPage";
import ThirdPage from "@/components/landing/thirdPage";
import FourthPage from "@/components/landing/fourthPage";

const MotionBox = motion(Box);

// 각 섹션의 이동 애니메이션 설정
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

// 개별 섹션 구성 함수
function FullSection({ children, id }: SectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.8,
    triggerOnce: false,
  });

  // 다음 섹션 id 정의
  const nextSectionId = {
    "search-landing": "first-landing",
    "first-landing": "second-landing",
    "second-landing": "third-landing",
    "third-landing": "fourth-landing",
    "fourth-landing": null,
  }[id || ""];

  const scrollToNext = () => {
    if (nextSectionId) {
      document
        .getElementById(nextSectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 스크롤 방향 저장
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
      position="relative"
      id={id}
      ref={ref}
      as="section"
      scrollSnapAlign="start"
      height="full"
      minH="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="20"
      custom={direction}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}

      {/* 다음 섹션으로 이동하는 아래 화살표 (마지막 섹션 제외) */}
      {nextSectionId ? (
        <MotionBox
          position="absolute"
          bottom="8"
          left="50%"
          transform="translateX(-50%)"
          cursor="pointer"
          onClick={scrollToNext}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          _hover={{ color: "gray.500" }}
        >
          <FaChevronDown size={30} />
        </MotionBox>
      ) : (
        // 마지막 섹션에서만 위로 가는 화살표 표시
        <MotionBox
          position="absolute"
          bottom="8"
          left="50%"
          transform="translateX(-50%) rotate(180deg)"
          cursor="pointer"
          onClick={() =>
            document
              .getElementById("search-landing")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          _hover={{ color: "gray.500" }}
        >
          <FaChevronUp size={30} />
        </MotionBox>
      )}
    </MotionBox>
  );
}

// 메인 페이지 구성
export default function Home() {
  const [activeSection, setActiveSection] = useState("first-landing");

  useEffect(() => {
    // 현재 스크롤 위치에 따라 활성 섹션 추적
    const handleScroll = () => {
      const sections = [
        "search-landing",
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
      {/* <Flex
        direction="column"
        position="fixed"
        top="50%"
        right="40px"
        transform="translateY(-50%)"
        zIndex="overlay"
        gap={3}
      >
        {[
          "search-landing", // search-landing 추가
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
            bg={activeSection === sectionId ? "green.500" : "gray.400"}
            _hover={{
              bg: activeSection === sectionId ? "green.600" : "gray.600",
            }}
            cursor="pointer"
            transition="all 0.3s"
            onClick={() =>
              document
                .getElementById(sectionId)
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        ))}
      </Flex> */}

      {/* 전체 섹션 구성 */}
      <FullSection id="search-landing">
        <LandingSearchPage />
      </FullSection>

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
  );
}
