"use client";

import { Button } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import { InterestButtonProps } from "@/lib/api/interfaces/interestOrganization";
import { getInterestCorporation, getInterestOrganization } from "@/lib/api/get";
import { deleteInterestCorporation } from "@/lib/api/delete";
import { postInterestCorporation } from "@/lib/api/post";
import { IoAddSharp, IoCheckmark } from "react-icons/io5";
import { toaster } from "../ui/toaster";

const AddButton = ({
  orgId,
  interestList,
  setInterestList,
  checked, // 추가
}: {
  orgId: string;
  interestList: string[];
  setInterestList: React.Dispatch<React.SetStateAction<string[]>>;
  checked?: boolean; // 추가
}) => {
  const isInterested =
    typeof checked === "boolean" ? checked : interestList.includes(orgId);

  const handleClick = () => {
    setInterestList((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId]
    );
  };

  return (
    <Button color="black" bg="white" onClick={handleClick}>
      {isInterested ? <IoCheckmark /> : <IoAddSharp />}
    </Button>
  );
};

export default AddButton;
