"use client";

import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { logout } from "@/lib/api/auth";
import Searching from "./navbar/searching";
import { FaSearch } from "react-icons/fa";
import { ExchangeRateChart } from "./dashboard";
import { RiLogoutCircleLine } from "react-icons/ri";
import { AiOutlineLogin } from "react-icons/ai";
import { useState, useEffect } from "react";
import { checkLogin } from "@/lib/api/auth";
import { CgProfile } from "react-icons/cg";
import { FaBookOpen } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

// 백엔드에서 받아온 회사 리스트의 타입을 정의

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logoutbtn = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await checkLogin();
      setIsLoggedIn(status);
    };
    checkLoginStatus();
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
      setIsLoggedIn(false);
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  return (
    <Flex
      direction="row"
      align="center"
      py={2}
      px={6}
      backgroundColor="white"
      boxShadow="sm"
      width="100%"
      position="fixed"
      top={0}
      zIndex={1000}
      height="65px"
      justify="space-between"
    >
      {/* 로고 =========================================================== */}
      <Flex align="center" flex={1} maxW="450px">
        <Box mr={6}>
          <Image
            src="/logo_2.png"
            height="50px"
            onClick={() => router.push("/")}
            cursor="pointer"
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.2s"
          />
        </Box>
        {/* 환율 & 탄소배출권 시세 ============================================== */}
        <Box flex={1}>
          <ExchangeRateChart />
        </Box>
      </Flex>

      {/* 검색 =========================== */}
      <Flex justify="center" flex={1} maxW="600px" px={4}>
        <Box
          display="flex"
          alignItems="center"
          gap="3"
          py={2}
          px={6}
          width="100%"
        >
          <FaSearch color="gray.500" />
          <Box flex={1}>
            <Searching />
          </Box>
        </Box>
      </Flex>

      <Flex align="center" justify="flex-end" flex={1} maxW="400px" gap={2}>
        {/* 용어 사전 ================================== */}
        {isLoggedIn && (
          <Button
            onClick={() => router.push("/dashboard/category")}
            variant="ghost"
            borderRadius="lg"
            minW="44px"
            h="44px"
            fontWeight="semibold"
            fontSize="md"
            transition="all 0.2s"
            px={3}
          >
            <FaRegHeart />
            관심기업
          </Button>
        )}
        <Button
          onClick={() => router.push("/dashboard/vocabulary")}
          variant="ghost"
          borderRadius="lg"
          minW="44px"
          h="44px"
          fontWeight="semibold"
          fontSize="md"
          _hover={{ bg: "gray.100" }}
          transition="all 0.2s"
          px={3}
        >
          <FaBookOpen />
          용어사전
        </Button>

        {/* 로그인 & 로그아웃 ================================================================== */}
        <Button
          onClick={handleAuthClick}
          variant="ghost"
          borderRadius="lg"
          minW="44px"
          h="44px"
          fontWeight="semibold"
          fontSize="md"
          transition="all 0.2s"
          px={3}
        >
          {isLoggedIn ? (
            <>
              <RiLogoutCircleLine size={18} />
              로그아웃
            </>
          ) : (
            <>
              <AiOutlineLogin size={18} />
              로그인
            </>
          )}
        </Button>
        {/* 마이페이지 ================================================================== */}
        {isLoggedIn && (
          <Button
            onClick={() => router.push("/myPage")}
            variant="ghost"
            size="md"
            display="flex"
            alignItems="center"
            color="gray.700"
            borderRadius="full"
            transition="all 0.2s ease"
            _hover={{
              bg: "gray.100",
              transform: "translateY(-1px)",
              shadow: "sm",
            }}
            _active={{
              transform: "translateY(0)",
              bg: "gray.200",
            }}
          >
            <CgProfile size="24px" />
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
