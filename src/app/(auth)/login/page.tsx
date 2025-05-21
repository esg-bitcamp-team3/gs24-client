"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { login } from "@/lib/api/auth";
import { toaster } from "@/components/ui/toaster";
import { ApiError } from "@/lib/util/handleApiError";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("모든 필드를 채워주세요.");
      return;
    }

    try {
      await login({
        username: username,
        password: password, // 비밀번호 추가
      });
      toaster.success({
        title: "로그인 성공!",
      });
      // setTimeout(() => console.log('로그인 성공!'), 1000)

      router.push("/");
    } catch (error) {
      toaster.error({
        title:
          error instanceof ApiError
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      });
    }
  };

  return (
    <Flex
      minH="100vh" // 화면 전체 높이
      justify="center" // 수평 중앙
      align="center" // 수직 중앙
      bg="  linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%)"
    >
      <Card.Root
        boxAlign={"center"}
        display="flex"
        justifyContent="center"
        paddingLeft={4}
        paddingRight={4}
        minH="50vh"
        maxW="lg"
        mx="auto"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        borderWidth="1px"
        borderColor="white"
      >
        <Box
          width={{ base: "100%", md: "400px" }}
          bg="transparent"
          p={8}
          borderRadius="md"
        >
          <Heading as="h2" size="3xl" color="black" textAlign="center" mb={8}>
            Sign in
          </Heading>
          <Stack gap={6}>
            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                ID
              </Text>
              <Input
                variant="flushed"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.300" }}
                borderColor="black"
              />
            </Box>

            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                Password
              </Text>
              <Input
                variant="flushed"
                placeholder=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.300" }}
                borderColor="black"
              />
            </Box>

            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              bg="black"
              color="white"
              _hover={{ bg: "gray.500" }}
              size="lg"
              fontWeight="bold"
              onClick={handleSubmit}
            >
              LOGIN
            </Button>
            <Flex justify="center">
              <Link
                href="/signup"
                color="black"
                fontSize="sm"
                textAlign="center"
                _hover={{ textDecoration: "underline" }}
              >
                Sign Up
              </Link>
            </Flex>
          </Stack>
        </Box>
      </Card.Root>
    </Flex>
  );
};

export default LoginPage;
