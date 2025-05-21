"use client";
import { getCorporationsWithInterest } from "@/lib/api/get";
import {
  Box,
  Button,
  Input,
  Dialog,
  Portal,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CorpWithInterest } from "@/lib/api/interfaces/corporation";
import { IoAddSharp } from "react-icons/io5";
import InterestButton from "@/components/etcs/InterestButton";
import AddButton from "@/components/etcs/addButton";
import { postCorporationCategory } from "@/lib/api/post";
import { toaster } from "@/components/ui/toaster";

interface SearchOrgProps {
  label: ReactNode;
  id: string; // 추가
  onSaved?: () => void;
}

const AddOrg = ({ label, id, onSaved }: SearchOrgProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyList, setCompanyList] = useState<CorpWithInterest[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [interestList, setInterestList] = useState<string[]>([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const filteredCompanies =
    searchTerm === ""
      ? companyList
      : companyList.filter((company) =>
          company.corporation.corpName
            .trim()
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        );

  const loadCompanies = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await getCorporationsWithInterest(); // 서버에서 page별 로딩
      console.log("🔥 data", data);

      setCompanyList((prev) => [...prev, ...data.corpWithInterestDTOList]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);
  useEffect(() => {
    if (isOpen) {
      // 다이얼로그 열리면 초기화
      setSearchTerm("");
      setPage(0);
      setCompanyList([]);
      setHasMore(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && companyList.length === 0 && page === 0) {
      // 초기 데이터 로딩
      loadCompanies();
    }

    if (!scrollContainerRef.current || !observerRef.current || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadCompanies();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 1.0,
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [isOpen, companyList.length, page, loadCompanies, loading, hasMore]);

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
          colorScheme="green"
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
            padding={6}
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
                bg="gray.50"
                borderColor="green.200"
                onChange={(e) =>
                  setSearchTerm((e.target as HTMLInputElement).value)
                }
              />
            </Dialog.Header>

            <Dialog.Body pt={2}>
              <Box
                height={320}
                overflowY="auto"
                ref={scrollContainerRef}
                bg="gray.50"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="green.100"
                p={2}
              >
                {filteredCompanies.length === 0 ? (
                  <Text color="gray.400" textAlign="center" py={8}>
                    No companies found.
                  </Text>
                ) : (
                  <VStack gap={0} align="stretch" w="100%">
                    {filteredCompanies.map((company, idx) => (
                      <React.Fragment key={company.corporation.corpCode}>
                        <HStack
                          w="100%"
                          px={3}
                          py={2}
                          bg={
                            interestList.includes(company.corporation.id)
                              ? "green.50"
                              : "white"
                          }
                          borderRadius="lg"
                          _hover={{ bg: "green.50" }}
                          transition="background 0.2s"
                          justifyContent="space-between"
                        >
                          <Text fontWeight="medium" color="green.800">
                            {company.corporation.corpName}
                          </Text>
                          <AddButton
                            orgId={company.corporation.id}
                            interestList={interestList}
                            setInterestList={setInterestList}
                            checked={interestList.includes(
                              company.corporation.id
                            )} // 추가
                          />
                        </HStack>
                      </React.Fragment>
                    ))}
                  </VStack>
                )}
                <Box ref={observerRef} h={"5%"} />
                {loading && (
                  <Text textAlign="center" color="gray.500" py={2}>
                    Loading...
                  </Text>
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
export default AddOrg;
