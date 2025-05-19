// src/pages/user-info.tsx
"use client";

import {
  checkingPassword,
  getUserInfo,
  updatePassword,
  updateUserInfo,
} from "@/lib/api/auth";
import { User } from "@/lib/api/interfaces/auth";
import {
  Box,
  Avatar,
  Input,
  VStack,
  Button,
  Text,
  Flex,
  Field,
  Center,
  Image,
  Separator,
  Tabs,
} from "@chakra-ui/react";
import { LuUser } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";

export default function userInfoPage({ id }: { id: string }) {
  // 상태 정의(useState), 사용자 전체 정보는 user에 저장
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); // 비밀번호 인증 상태 관리
  const [currentPassword, setCurrentPassword] = useState("");
  const [check, setCheck] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 사용자 정보 가져오기 (useEffect), 받은 정보를 상태로 저장
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserInfo(); // getUserInfo() -> 서버 API 호출 함수 (GET /user/mypage)
        setUser(res ?? null);
        setName(res?.name ?? "");
        setPhone(res?.phone ?? "");
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUser();
  }, []);

  const handleCheck = async () => {
    try {
      const tf = await checkingPassword({ password: currentPassword });
      setCheck(Boolean(tf));
      if (!tf) {
        setPasswordError("비밀번호가 일치하지 않습니다.");
      } else {
        setPasswordError("");
      }
    } catch (error) {
      console.error("비밀번호 확인 실패: ", error);
      setPasswordError("비밀번호 확인에 실패했습니다.");
    }
  };
  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    try {
      await updateUserInfo({ name, phone }); // 이름, 전화번호 업데이트

      alert("정보가 저장되었습니다.");
    } catch (err) {
      console.error("업데이트 실패:", err);
      console.error("에러 상세:", err);
      alert("저장에 실패했습니다.");
    }
  };

  const passwordSave = async () => {
    try {
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
      } else {
        try {
          await updatePassword(password);
          alert("비밀번호 변경 완료");
        } catch (err) {
          alert("비밀번호 변경 실패");
          console.error(err);
        }
      }
    } catch (err) {
      alert("비밀번호 저장 실패");
    }
  };

  return (
    <Flex
      minH="full" // 뷰포트 높이만큼 차지
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#f7f7f7" // 배경 유지
    >
      <Box
        p={10}
        maxW="650px"
        w="full"
        minH="600px"
        bg="white"
        rounded="2xl"
        boxShadow="md"
      >
        <Text
          fontSize="4xl"
          fontWeight="bold"
          mb={6}
          justifyContent="center"
          width="full"
          textAlign="center"
        >
          사용자 정보
        </Text>
        {/* <Separator mt={2} mb={6} /> */}

        <Tabs.Root defaultValue="profile" variant="enclosed">
          <Flex justify="center" w="100%" mb="4">
            <Tabs.List
              bg="transparent" // 부모 배경 없애기
              p="1"
              gap="2"
              boxShadow="sm"
            >
              <Tabs.Trigger
                value="profile"
                px="4"
                py="2"
                borderRadius="md"
                _selected={{ bg: "gray.100", fontWeight: "bold" }}
              >
                <LuUser />
                &nbsp;기본정보 변경
              </Tabs.Trigger>

              <Tabs.Trigger
                value="password"
                px="4"
                py="2"
                borderRadius="md"
                _selected={{ bg: "gray.100", fontWeight: "bold" }}
              >
                <TbLockPassword />
                &nbsp;비밀번호 변경
              </Tabs.Trigger>
            </Tabs.List>
          </Flex>

          <Tabs.Indicator rounded="sm" />

          <Tabs.Content value="profile">
            <Flex align="flex-start" gap={6}>
              {/* 정보 입력 폼 ================================================================== */}
              <VStack padding={5} flex={1} align="stretch" gap={7}>
                <Field.Root orientation="horizontal">
                  <Field.Label>사용자명</Field.Label>
                  <Input
                    paddingLeft={2}
                    css={{ "--focus-color": "colors.blackAlpha.300" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>아이디</Field.Label>
                  <Input
                    disabled
                    paddingLeft={2}
                    value={user?.username ?? "id"}
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>이메일</Field.Label>
                  <Input
                    disabled
                    paddingLeft={2}
                    value={user?.email ?? "email"}
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>휴대전화</Field.Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field.Root>

                <Button
                  mt={2}
                  bg="gray.700"
                  colorScheme="gray"
                  width="100px"
                  alignSelf="end"
                  onClick={handleSave}
                >
                  저장
                </Button>
              </VStack>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="password">
            <Flex align="flex-start" gap={6}>
              <VStack padding={5} flex={1} align="stretch">
                <Field.Root>
                  <Field.Label>기존 비밀번호</Field.Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    borderColor={
                      passwordError
                        ? "red.300"
                        : check
                        ? "green.300"
                        : undefined
                    }
                  />
                  {passwordError ? (
                    <Text color="red.500" fontSize="sm" mt="1">
                      {passwordError}
                    </Text>
                  ) : (
                    check && (
                      <Text color="green.500" fontSize="sm" mt="1">
                        비밀번호가 확인되었습니다.
                      </Text>
                    )
                  )}
                  <Button
                    mt={2}
                    bg="gray.700"
                    colorScheme="gray"
                    width="100px"
                    alignSelf="end"
                    onClick={handleCheck}
                  >
                    비밀번호 확인
                  </Button>
                </Field.Root>

                <Field.Root>
                  <Field.Label>새 비밀번호</Field.Label>
                  <Input
                    type="password"
                    value={check ? password : ""}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!check}
                    placeholder={check ? "" : " 비밀번호를 먼저 확인해주세요"}
                    bg={check ? "white" : "gray.50"}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>새 비밀번호 확인</Field.Label>
                  <Input
                    type="password"
                    value={check ? confirmPassword : ""}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!check}
                    placeholder={check ? "" : " 비밀번호를 먼저 확인해주세요"}
                    bg={check ? "white" : "gray.a50"}
                  />
                </Field.Root>

                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}
                <Button
                  mt={2}
                  bg="gray.700"
                  colorScheme="gray"
                  width="100px"
                  alignSelf="end"
                  onClick={passwordSave}
                >
                  저장
                </Button>
              </VStack>
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Flex>
  );
}
