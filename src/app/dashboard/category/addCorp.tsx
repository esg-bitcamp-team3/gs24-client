"use client";
import { getCorporationsWithInterest } from "@/lib/api/get";
import { IoAddSharp } from "react-icons/io5";
import AddButton from "@/components/etcs/addButton";
import { postCorporationCategory } from "@/lib/api/post";
import { toaster } from "@/components/ui/toaster";
import { getCorporationList } from "@/lib/api/get";
import {
  Box,
  Button,
  Input,
  Text,
  Dialog,
  Portal,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Corporation,
  CorpWithInterest,
} from "@/lib/api/interfaces/corporation";
import { FixedSizeList as List } from "react-window";

interface SearchOrgProps {
  label: ReactNode;
  id: string; // 추가
  onSaved?: () => void;
}

interface rowProps {
  index: number;
  style: React.CSSProperties;
  data: CorpWithInterest[];
}

const AddCorp = ({ label, id, onSaved }: SearchOrgProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyList, setCompanyList] = useState<Corporation[]>([]);
  const [interestList, setInterestList] = useState<string[]>([]);

  const filteredCompanies =
    searchTerm === ""
      ? companyList
      : companyList.filter((company) =>
          company.corpName
            .trim()
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        );

  const loadCompanies = async () => {
    try {
      const data = await getCorporationList();
      setCompanyList(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  useEffect(() => {
    loadCompanies();
  }, [companyList]);

  const Row = ({ index, style, data }: rowProps) => {
    const company = data[index];
    return (
      <Box key={company.corporation.corpCode} style={style}>
        <HStack
          w="100%"
          px={3}
          py={2}
          bg={
            interestList.includes(company.corporation.id) ? "gray.300" : "white"
          }
          // borderRadius="lg"
          _hover={{ bg: "gray.300" }}
          transition="background 0.2s"
          justifyContent="space-between"
        >
          <Text fontWeight="medium">{company.corporation.corpName}</Text>
          <AddButton
            orgId={company.corporation.id}
            interestList={interestList}
            setInterestList={setInterestList}
            checked={interestList.includes(company.corporation.id)} // 추가
          />
        </HStack>
      </Box>
    );
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
      scrollBehavior={"inside"}
      placement="center"
    >
      <Dialog.Trigger asChild>
        <Button
          variant="solid"
          size="md"
          borderRadius="full"
          px={6}
          py={2}
          fontWeight="bold"
          boxShadow="md"
        >
          {label}
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop bg="blackAlpha.400" />
        <Dialog.Positioner>
          <Dialog.Content
            padding={8}
            borderRadius="2xl"
            bg="white"
            boxShadow="2xl"
            minW="350px"
            maxW="400px"
          >
            <Dialog.Header>
              <Input
                paddingLeft={3}
                marginBottom={3}
                placeholder="기업명 검색"
                value={searchTerm}
                borderRadius="full"
                onChange={(e) =>
                  setSearchTerm((e.target as HTMLInputElement).value)
                }
              />
            </Dialog.Header>

            <Dialog.Body pt={2} paddingY={4}>
              <Box
                width="100%"
                h="100%"
                overflowY="auto"
                bg="white"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                {filteredCompanies.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={2}>
                    No companies found.
                  </Text>
                ) : (
                  <List
                    height={300}
                    itemCount={filteredCompanies.length}
                    itemSize={50}
                    width="100%"
                    itemData={filteredCompanies.map((company) => ({
                      corporation: company,
                      interested: false,
                    }))}
                  >
                    {Row}
                  </List>
                )}
              </Box>
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                variant="solid"
                colorScheme="green"
                borderRadius="full"
                fontWeight="bold"
                flex={1}
                onClick={async () => {
                  try {
                    await postCorporationCategory({ idList: interestList }, id);
                    if (onSaved) onSaved();
                    toaster.create({
                      title: "저장에 성공했습니다.",
                      type: "success",
                    });
                    setIsOpen(false);
                  } catch (e) {
                    toaster.create({
                      title: "저장에 실패했습니다.",
                      type: "error",
                    });
                  }
                }}
              >
                저장
              </Button>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" borderRadius="full" flex={1}>
                  닫기
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default AddCorp;
