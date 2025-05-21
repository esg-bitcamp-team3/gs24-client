"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  Portal,
  Checkbox,
  Fieldset,
  CheckboxGroup,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { InterestButtonProps } from "@/lib/api/interfaces/interestOrganization";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { getCategory, getInterestCorporation } from "@/lib/api/get";
import { deleteCategory } from "@/lib/api/delete";
import {
  postCoporationCategries,
  postInterestCorporation,
} from "@/lib/api/post";
import { checkLogin } from "@/lib/api/auth";
import CategoryDialog from "./categoryDialog";
import { Category } from "@/lib/api/interfaces/category";

const defaultValues = {
  category: [], // id 배열
};
interface FormValues {
  category: string[]; // id 배열
}

const InterestButton = ({ orgId }: InterestButtonProps) => {
  const [isInterested, setIsInterested] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [checked, setChecked] = useState(false);

  const handleClick = async () => {
    try {
      const chkLogin = await checkLogin();
      if (chkLogin) {
        if (isInterested) {
          await postCoporationCategries({
            corporationId: orgId,
            idList: [], // form으로부터 직접 받음
          });
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

  useEffect(() => {
    const checkInterest = async () => {
      try {
        const chkLogin = await checkLogin();
        setChecked(chkLogin);
        const data = await getInterestCorporation(orgId);
        if (data) {
          setIsInterested(true);
        }
        const categorydata = await getCategory();
        setCategoryList(categorydata || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    checkInterest();
  }, [categoryList, isInterested]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  const onSubmit = async (data: FormValues) => {
    try {
      await postCoporationCategries({
        corporationId: orgId,
        idList: data.category ?? [], // form으로부터 직접 받음
      });
      console.log("등록 성공");
      setIsInterested(true);
      setIsOpen(false);
    } catch (error) {
      console.error("등록 실패:", error);
    }
  };
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
        scrollBehavior="inside"
        placement="center"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(2px)",
            }}
          />
          <Dialog.Positioner>
            <Dialog.Content
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                padding: "24px",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <Dialog.Header>
                <Dialog.Title
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  관심 기업 등록
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Box
                  style={{
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <CategoryDialog />

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Fieldset.Root invalid={!!errors.category}>
                      <Controller
                        name="category"
                        control={control}
                        rules={{ required: "카테고리를 하나 이상 선택하세요." }}
                        render={({ field }) => (
                          <CheckboxGroup
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <Fieldset.Content>
                              {categoryList.map((category) => (
                                <Checkbox.Root
                                  key={category.id}
                                  value={category.id}
                                >
                                  <Box
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      backgroundColor: "#f5f5f5",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <Box
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      <Checkbox.HiddenInput />
                                      <Checkbox.Control />
                                      <Checkbox.Label>
                                        {category.name}
                                      </Checkbox.Label>
                                    </Box>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        const updated = field.value.filter(
                                          (v) => v !== category.id
                                        );
                                        field.onChange(updated);
                                        deleteClick(category.id);
                                      }}
                                      style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "#e74c3c",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      ✕
                                    </Button>
                                  </Box>
                                </Checkbox.Root>
                              ))}
                            </Fieldset.Content>
                          </CheckboxGroup>
                        )}
                      />
                      {errors.category && (
                        <Fieldset.ErrorText>
                          {errors.category.message}
                        </Fieldset.ErrorText>
                      )}
                    </Fieldset.Root>

                    <Dialog.Footer
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "24px",
                      }}
                    >
                      <Button type="submit">등록</Button>
                      <Button type="button" onClick={() => setIsOpen(false)}>
                        취소
                      </Button>
                    </Dialog.Footer>
                  </form>
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default InterestButton;
