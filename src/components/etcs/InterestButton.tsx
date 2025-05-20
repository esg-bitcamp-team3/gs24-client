"use client";

import { Button } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import { InterestButtonProps } from "@/lib/api/interfaces/interestOrganization";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { getInterestCorporation, getInterestOrganization } from "@/lib/api/get";
import { deleteInterestCorporation } from "@/lib/api/delete";
import { postInterestCorporation } from "@/lib/api/post";
import { checkLogin } from "@/lib/api/auth";

const InterestButton = ({ orgId }: InterestButtonProps) => {
  const [isInterested, setIsInterested] = useState(false);

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
  useEffect(() => {
    const checkInterest = async () => {
      try {
        const data = await getInterestCorporation(orgId);
        if (data) {
          setIsInterested(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    checkInterest();
  }, []);

  return (
    <Button color="black" bg="white" onClick={handleClick}>
      {isInterested ? <FcLike /> : <FcLikePlaceholder />}
    </Button>
  );
};

export default InterestButton;
