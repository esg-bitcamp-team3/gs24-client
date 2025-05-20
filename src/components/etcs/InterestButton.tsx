"use client";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Flex,
  Portal,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { InterestButtonProps } from "@/lib/api/interfaces/interestOrganization";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { getInterestCorporation, getMyCategory } from "@/lib/api/get";
import { deleteCategory, deleteInterestCorporation } from "@/lib/api/delete";
import {
  postCoporationCategries,
  postInterestCorporation,
} from "@/lib/api/post";
import { checkLogin } from "@/lib/api/auth";
import CategoryDialog from "./categoryDialog";
import { Category, InterestCategories } from "@/lib/api/interfaces/category";

const InterestButton = ({ orgId }: InterestButtonProps) => {
  const [isInterested, setIsInterested] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const handleClick = async () => {
    try {
      const chkLogin = await checkLogin();
      if (chkLogin) {
        if (isInterested) {
          await deleteInterestCorporation(orgId);
          console.log("관심기업 삭제 성공");
          setIsInterested(false);
        } else {
          await postInterestCorporation(orgId);
          console.log("관심기업 등록 성공");
          setIsInterested(true);
        }
      } else {
        alert("로그인 후 이용해주세요.");
      }
    } catch (error) {
      console.error("관심기업 처리 실패:", error);
    }
  };
  const deleteClick = async (id: string) => {
    try {
      await deleteCategory(id);
      console.log("관심기업 삭제 성공");
      setIsInterested(false);
    } catch (error) {
      console.error("관심기업 삭제 실패:", error);
    }
  };
  const handleCheckboxChange = (checked: boolean, id: string) => {
    setSelectedCategory((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };
  const addCategory = async (orgId: string, selectedCategory: string[]) => {
    try {
      await postCoporationCategries({
        corporationId: orgId,
        idList: selectedCategory,
      });
      console.log("잘 들어감");
      setIsInterested(true);
    } catch (error) {
      console.error("실패", error);
    }
  };
  useEffect(() => {
    const checkInterest = async () => {
      try {
        const chkLogin = await checkLogin();
        setChecked(chkLogin);
        const data = await getInterestCorporation(orgId);
        if (data) {
          setIsInterested(true);
        }
        const categorydata = await getMyCategory();
        setCategoryList(categorydata || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    checkInterest();
  }, [categoryList]);

  return (
    <>
      <Button
        color="black"
        bg="white"
        onClick={() =>
          isInterested
            ? handleClick()
            : checked
            ? setIsOpen(true)
            : alert("로그인 후 이용해주세요.")
        }
      >
        {isInterested ? <FcLike /> : <FcLikePlaceholder />}
      </Button>

      <Dialog.Root
        scrollBehavior={"inside"}
        placement="center"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content padding={4}>
              <Dialog.Header>
                <Dialog.Title>관심 기업 등록</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Box
                  height={300}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <CategoryDialog />
                  {categoryList.length > 0 ? (
                    categoryList.map((category) => (
                      <>
                        <Flex key={category.id}>
                          <Checkbox.Root
                            checked={selectedCategory.includes(category.id)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(!!checked, category.id)
                            }
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>{category.name}</Checkbox.Label>
                          </Checkbox.Root>
                          <Button
                            variant="ghost"
                            color="black"
                            justifyContent="flex-end"
                            onClick={() => deleteClick(category.id)}
                          >
                            X
                          </Button>
                        </Flex>
                      </>
                    ))
                  ) : (
                    <>
                      <Text textAlign="center">관심 등록 기업이 없습니다.</Text>
                      <Text textAlign="center">
                        관심 등록 기업을 등록하시겠습니까?
                      </Text>
                    </>
                  )}
                </Box>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={async () => {
                    // await handleClick();
                    setIsOpen(false);
                    await addCategory(orgId, selectedCategory);
                  }}
                >
                  등록
                </Button>
                <Button variant="ghost" ml={3} onClick={() => setIsOpen(false)}>
                  취소
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default InterestButton;
