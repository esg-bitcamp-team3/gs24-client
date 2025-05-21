"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  Portal,
  Text,
  Checkbox,
  Fieldset,
  CheckboxGroup,
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
import { Category } from "@/lib/api/interfaces/category";

const defaultValues = {
  category: [], // id 배열
};

interface CategoryFormProps {
  orgId: string;
  categoryList: Category[];
  deleteClick: (id: string) => void;
}

const CategoryForm = ({
  orgId,
  categoryList,
  deleteClick,
}: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (data: { category: string[] }) => {
    try {
      await postCoporationCategries({
        corporationId: orgId,
        idList: data.category,
      });
      console.log("잘 들어감");
      // setIsInterested(true);
    } catch (error) {
      console.error("실패", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset.Root invalid={!!errors.category}>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Please select at least one category." }}
          render={({ field }) => (
            <CheckboxGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              invalid={!!errors.category}
            >
              <Fieldset.Content>
                {categoryList.map((category) => (
                  <Checkbox.Root key={category.id} value={category.id}>
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
                        <Checkbox.Label style={{ color: "#333" }}>
                          {category.name}
                        </Checkbox.Label>
                      </Box>

                      <Button
                        type="button"
                        onClick={() => {
                          // 해당 카테고리 삭제
                          const updated = field.value.filter(
                            (v) => v !== category.id
                          );
                          field.onChange(updated);
                          deleteClick(category.id); // 원래 있던 삭제 로직도 실행
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
          <Fieldset.ErrorText>{errors.category.message}</Fieldset.ErrorText>
        )}

        {/* <Button size="sm" type="submit" alignSelf="flex-start">
          Submit
        </Button> */}
      </Fieldset.Root>
    </form>
  );
};

export default CategoryForm;
