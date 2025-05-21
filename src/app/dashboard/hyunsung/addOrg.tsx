"use client";
import { getCorporationsWithInterest } from "@/lib/api/get";
import { Box, Button, Input, Dialog, Portal, Text } from "@chakra-ui/react";
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
      const data = await getCorporationsWithInterest(page); // 서버에서 page별 로딩
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
        <Button variant="outline" size="sm" padding={3}>
          {label}
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={4}>
            <Dialog.Header>
              <Input
                paddingLeft={3}
                marginBottom={3}
                placeholder="search"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm((e.target as HTMLInputElement).value)
                }
              />
            </Dialog.Header>

            <Dialog.Body pt="4">
              <Box height={300} overflowY="scroll" ref={scrollContainerRef}>
                {filteredCompanies.length === 0 ? (
                  <Text color="gray.500" textAlign="center">
                    No companies found.
                  </Text>
                ) : (
                  filteredCompanies.map((company) => (
                    <Box
                      key={company.corporation.corpCode}
                      display="flex"
                      w="90%"
                    >
                      <Button
                        paddingLeft={3}
                        variant="ghost"
                        color="black"
                        justifyContent="flex-start"
                        w={"100%"}
                      >
                        {company.corporation.corpName}
                      </Button>
                      <AddButton
                        orgId={company.corporation.id}
                        interestList={interestList}
                        setInterestList={setInterestList}
                      />
                    </Box>
                  ))
                )}
                {/* 스크롤 끝 감지 트리거 */}
                <Box ref={observerRef} h={"5%"} />
                {loading && (
                  <Text textAlign="center" color="gray.500">
                    Loading...
                  </Text>
                )}
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="solid"
                colorScheme="green"
                marginTop={3}
                padding={3}
                onClick={async () => {
                  try {
                    await postCorporationCategory({ idList: interestList }, id);
                    if (onSaved) onSaved();
                    // 토스트 메시지 (예시)
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
                Save
              </Button>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" marginTop={3} padding={3}>
                  Close
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
