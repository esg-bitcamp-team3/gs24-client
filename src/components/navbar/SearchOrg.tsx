"use client";
import { getCorporationList, getCorporationsWithInterest } from "@/lib/api/get";
import { Box, Button, Input, Dialog, Portal, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import InterestButton from "../etcs/InterestButton";
import {
  Corporation,
  CorpWithInterest,
} from "@/lib/api/interfaces/corporation";
import { FixedSizeList as List } from "react-window";
import { checkLogin } from "@/lib/api/auth";

interface SearchOrgProps {
  label: ReactNode;
}
interface rowProps {
  index: number;
  style: React.CSSProperties;
  data: CorpWithInterest[];
}

const SearchOrg = ({ label }: SearchOrgProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyList, setCompanyList] = useState<CorpWithInterest[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCompanyClick = (companyId: string) => {
    setIsOpen(false);
    router.push(`/dashboard/${companyId}/companyInfo`);
  };

  const filteredCompanies =
    searchTerm === ""
      ? companyList
      : companyList.filter((company) =>
          company.corporation.corpName
            .trim()
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        );

  const loadCompanies = async () => {
    try {
      const chkLogin = await checkLogin();
      if (chkLogin) {
        const data = await getCorporationsWithInterest(); // 서버에서 page별 로딩
        setCompanyList(data);
      } else {
        const data2 = await getCorporationList(); // 서버에서 전체 로딩
        const withInterestFalse: CorpWithInterest[] = (data2 ?? []).map(
          (corp) => ({
            corporation: corp,
            interested: false,
          })
        );
        setCompanyList(withInterestFalse);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  useEffect(() => {
    if (companyList.length === 0) {
      loadCompanies();
    }
    if (isOpen) {
      // 다이얼로그 열리면 초기화
      setSearchTerm("");
    }
  }, [isOpen]);

  // 가상화를 위한 row
  const Row = ({ index, style, data }: rowProps) => {
    const company = data[index];
    return (
      <Box style={style} key={company.corporation.id} display="flex" w="90%">
        <Button
          paddingLeft={3}
          variant="ghost"
          color="black"
          justifyContent="flex-start"
          onClick={() => handleCompanyClick(company.corporation.id)}
          w="90%"
        >
          {company.corporation.corpName}
        </Button>
        <InterestButton orgId={company.corporation.id} />
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
              <Box height={300}>
                {filteredCompanies.length === 0 ? (
                  <Text color="gray.500" textAlign="center">
                    No companies found.
                  </Text>
                ) : (
                  <List
                    height={300}
                    itemCount={filteredCompanies.length}
                    itemSize={50}
                    width="100%"
                    itemData={filteredCompanies}
                  >
                    {Row}
                  </List>
                )}
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
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
export default SearchOrg;
