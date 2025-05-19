import InterestButton from "@/components/etcs/InterestButton";
import SideBar from "@/components/sideBar";
import { getCorporationInfo } from "@/lib/api/get";
import { Box, Flex, Separator, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: { id: string };
}
export default async function CorpId({ children, params }: LayoutProps) {
  const companyinfo = await getCorporationInfo(params.id);

  return (
    <>
      <SideBar />
      <Box
        ml={"250px"}
        overflow={"auto"}
        maxW={"full"}
        maxH="full"
        bg={"#f7f7f7"}
      >
        <Flex align="center" ml={4} gap={2} mb={4}>
          <Separator orientation="vertical" height="1.75em" borderWidth="2px" />
          <Text fontSize="3xl" fontWeight="bold">
            {companyinfo?.corpName}
          </Text>
          <Box ml={4}>
            {companyinfo?.id && <InterestButton orgId={companyinfo.id} />}
          </Box>
        </Flex>
        {children}
      </Box>
    </>
  );
}
