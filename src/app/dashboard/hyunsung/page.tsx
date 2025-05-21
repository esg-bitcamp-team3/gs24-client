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

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [companyList, setCompanyList] = useState<CategoryCorporation[]>([]);

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
      p={6}
      maxW="700px"
      mx="auto"
      mt={8}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <Tabs.Root
        value={selectedTab}
        variant="outline"
        size="sm"
        onValueChange={(details) => setSelectedTab(details.value)}
      >
        <Tabs.List flex="1 1 auto" gap={4} maxW="600px" overflowX="auto">
          {categories.map((item) => (
            <Tabs.Trigger value={item.id} key={item.id} paddingLeft="7px">
              {item.name}
              <CloseButton
                as="span"
                role="button"
                size="2xs"
                me="2"
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

        <Tabs.ContentGroup>
          {categories.map((item) => (
            <Tabs.Content value={item.id} key={item.id}>
              <DataList.Root
                orientation="horizontal"
                divideY="1px"
                maxH="400px"
                overflowY="auto"
                px="10px"
              >
                {companyList.length === 0 && (
                  <Text color="gray.500" textAlign="center" py={8}>
                    기업이 없습니다.
                  </Text>
                )}
                {companyList.map((company) => (
                  <DataList.Item
                    key={
                      company?.interestCorporationDetailDTO?.corporation
                        ?.corpName
                    }
                    pt="4"
                  >
                    <DataList.ItemValue>
                      {
                        company?.interestCorporationDetailDTO?.corporation
                          ?.corpName
                      }
                    </DataList.ItemValue>
                  </DataList.Item>
                ))}
              </DataList.Root>
              <HStack justifyContent="center">
                <AddOrg
                  label={
                    <>
                      <LuSearch />
                    </>
                  }
                  id={item.id}
                  onSaved={() => {
                    // 현재 선택된 탭과 일치할 때만 갱신
                    if (selectedTab === item.id) {
                      getCategoryCorporation(item.id).then((data) =>
                        setCompanyList(data ?? [])
                      );
                    }
                  }}
                />
                <Heading size="xl" my="6">
                  기업 추가하기
                </Heading>
              </HStack>
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </Box>
  );
}
