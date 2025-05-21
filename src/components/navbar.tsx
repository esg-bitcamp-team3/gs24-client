// src/components/Navbar.tsx
"use client";

import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { LuLogOut, LuSearch } from "react-icons/lu";
import { logout } from "@/lib/api/auth";
import Searching from "./navbar/searching";
import { FaSearch } from "react-icons/fa";
import { ExchangeRateChart } from "./dashboard";

// 백엔드에서 받아온 회사 리스트의 타입을 정의

const Navbar: React.FC = () => {
  const router = useRouter();

  const logoutbtn = () => {
    logout();
    router.push("/");
  };

  return (
    <Flex
      direction="row"
      align="center"
      py="2"
      justify="space-between"
      backgroundColor="white"
      boxShadow="sm"
      shadowColor={"blackAlpha.200"}
      width="100%"
      position="fixed" // 💡 화면 상단에 고정
      top="0" // 💡 위에서 0 위치
      zIndex="1000" // 💡 다른 요소보다 위에 출력
      height="65px" // 💡 높이도 명시적으로 주면 안정감 있어
      gap="4"
    >
      <Box display="flex" paddingX="4" alignItems="center" width="10%">
        <Image
          src="/logo.png"
          onClick={() => router.push("/dashboard")}
          cursor="pointer"
        />
      </Box>
      <ExchangeRateChart />
      <Box display="flex" paddingX="2" alignItems="center">
        <FaSearch aria-atomic />
      </Box>

      <Searching />

      <Box display="flex" alignItems="center" gap="4">
        <Button
          onClick={() => router.push("/dashboard/vocabulary")}
          color="black"
          bg="white"
          border="1px solid #000000"
          padding={"0.5rem"}
        >
          용어사전
        </Button>
        {/* 아바타================================================================== */}
        <div
          onClick={() => router.push("/myPage")}
          style={{ cursor: "pointer" }}
        >
          <Avatar.Root shape="full" size="lg">
            <Avatar.Fallback name="Segun Adebayo" />
            {/* <Avatar.Image src="@public/user.png" /> */}
          </Avatar.Root>
        </div>
        {/* 나가기 버튼================================================================== */}
        <IconButton
          marginEnd={3}
          variant="ghost"
          color="black"
          aria-label="Logout"
          onClick={() => logoutbtn()}
        >
          <LuLogOut />
        </IconButton>
      </Box>
    </Flex>
  );
};

export default Navbar;
