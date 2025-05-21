"use client";

import {
  Box,
  Button,
  CloseButton,
  DataList,
  Heading,
  HStack,
  Slider,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";
import AddCategory from "./addCategory";
import SearchOrg from "@/components/navbar/SearchOrg";
import AddOrg from "./addOrg";
import {
  Category,
  CategoryCorporation,
  CorpWithInterest,
} from "@/lib/api/interfaces/corporation";
import {
  getCategory,
  getCategoryCorporation,
  getCorporationsWithInterest,
} from "@/lib/api/get";
import { deleteCategory } from "@/lib/api/delete";
import { postCategory } from "@/lib/api/post";
import { useRouter } from "next/navigation";

const TABS_PER_PAGE = 5;

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [companyList, setCompanyList] = useState<CategoryCorporation[]>([]);
  const [tabPage, setTabPage] = useState(0);
  const router = useRouter();

  const pagedCategories = categories.slice(
    tabPage * TABS_PER_PAGE,
    (tabPage + 1) * TABS_PER_PAGE
  );
  const totalPages = Math.ceil(categories.length / TABS_PER_PAGE);

  // 카테고리 목록 불러오기
  const fetchCategories = async () => {
    const data = await getCategory();
    if (data && data.length > 0) {
      setCategories(data);
      setSelectedTab((prev) =>
        data.find((cat) => cat.id === prev) ? prev : data[0].id
      );
    } else {
      setCategories([]);
      setSelectedTab(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addTab = async (categoryName: string) => {
    await postCategory({ name: categoryName });
    fetchCategories();
  };

  const handleCompanyClick = (companyId: string) => {
    router.push(`/dashboard/${companyId}/companyInfo`);
  };

  // 카테고리 삭제
  const removeTab = async (categoryId: string) => {
    await deleteCategory(categoryId);
    fetchCategories();
  };

  useEffect(() => {
    if (selectedTab) {
      console.log(selectedTab);
      getCategoryCorporation(selectedTab).then((data) => {
        setCompanyList(data ?? []);
      });
    } else {
      setCompanyList([]);
    }
  }, [selectedTab]);

  return (
    <Box
      p={8}
      maxW="700px"
      mx="auto"
      mt={10}
      borderWidth="1px"
      borderRadius="2xl"
      boxShadow="2xl"
      bg="white"
    >
      <Tabs.Root
        value={selectedTab}
        variant="outline"
        size="sm"
        onValueChange={(details) => setSelectedTab(details.value)}
      >
        <HStack w="100%" mb={6} gap={2}>
          <Button
            size="sm"
            onClick={() => setTabPage((p) => Math.max(0, p - 1))}
            disabled={tabPage === 0}
            variant="ghost"
          >
            {"<"}
          </Button>
          <Tabs.List
            flex="1 1 auto"
            gap={2}
            maxW="600px"
            overflowX="hidden"
            whiteSpace="nowrap"
            justifyContent="flex-start"
          >
            {pagedCategories.map((item) => (
              <Tabs.Trigger
                value={item.id}
                key={item.id}
                px={5}
                py={2}
                borderRadius="full"
                fontWeight="bold"
                _selected={{ bg: "green.100", color: "green.700" }}
                _hover={{ bg: "gray.100" }}
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={2}
                whiteSpace="nowrap"
              >
                {item.name}
                <CloseButton
                  as="span"
                  role="button"
                  size="2xs"
                  me="1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(item.id);
                  }}
                />
              </Tabs.Trigger>
            ))}
            <AddCategory
              onSave={(categoryName) => {
                addTab(categoryName);
              }}
            />
          </Tabs.List>
          <Button
            size="sm"
            onClick={() => setTabPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={tabPage >= totalPages - 1}
            variant="ghost"
          >
            {">"}
          </Button>
        </HStack>
        <Tabs.ContentGroup>
          {categories.map((item) => (
            <Tabs.Content value={item.id} key={item.id}>
              <VStack gap={6} align="center" w="100%">
                <Box
                  w="100%"
                  maxW="500px"
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="gray.50"
                  p={4}
                  boxShadow="sm"
                  minH="180px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  {companyList.length === 0 ? (
                    <Text color="gray.400" textAlign="center" py={8}>
                      기업이 없습니다.
                    </Text>
                  ) : (
                    <DataList.Root
                      orientation="horizontal"
                      w="100%"
                      maxH="400px"
                      overflowY="auto"
                      divideY="1px" // 이 줄 추가!
                      borderColor="gray.200" // 구분선 색상 지정
                    >
                      <VStack gap={2} w="100%">
                        {companyList.map((company) => (
                          <HStack
                            key={
                              company?.interestCorporationDetailDTO?.corporation
                                ?.corpName
                            }
                            w="100%"
                            justifyContent="center"
                            gap={3}
                            py={2}
                          >
                            <DataList.ItemValue
                              fontWeight="medium"
                              cursor="pointer"
                              onClick={() =>
                                handleCompanyClick(
                                  company?.interestCorporationDetailDTO
                                    ?.corporation?.id
                                )
                              }
                            >
                              {
                                company?.interestCorporationDetailDTO
                                  ?.corporation?.corpName
                              }
                            </DataList.ItemValue>
                            {/* <CloseButton size="sm" onClick={() => {}} /> */}
                          </HStack>
                        ))}
                      </VStack>
                    </DataList.Root>
                  )}
                </Box>
                <VStack gap={2} w="100%">
                  <AddOrg
                    label="기업 추가하기"
                    id={item.id}
                    onSaved={() => {
                      if (selectedTab === item.id) {
                        getCategoryCorporation(item.id).then((data) =>
                          setCompanyList(data ?? [])
                        );
                      }
                    }}
                  />
                </VStack>
              </VStack>
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </Box>
  );
}
