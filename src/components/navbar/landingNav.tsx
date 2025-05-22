"use client";

import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { logout } from "@/lib/api/auth";
import { RiLogoutCircleLine } from "react-icons/ri";
import { AiOutlineLogin } from "react-icons/ai";
import { useState, useEffect } from "react";
import { checkLogin } from "@/lib/api/auth";

// 백엔드에서 받아온 회사 리스트의 타입을 정의

const LandingNav: React.FC = () => {
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
      width="100%"
      position="fixed"
      top={0}
      zIndex={1000}
      height="65px"
      justify="end"
    >
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
    </Flex>
  );
};

export default LandingNav;
