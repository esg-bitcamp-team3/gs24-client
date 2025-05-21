import { financeApi } from "@/lib/api/apiclient";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";

interface OpenDartProps {
  corpCode: string;
}

const OpenDart = ({ corpCode }: OpenDartProps) => {
  const [rceptNo, setRceptNo] = useState("");
  const year = new Date().getFullYear() - 1;
  const getRcepNo = async () => {
    try {
      const response = await financeApi.get(
        `single-financial?corp_code=${corpCode}&year=${year}&report_code=11011&fs_div=OFS`
      );
      console.log("response", response.data);
      setRceptNo(response.data.list[0].rcept_no);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const link: string = `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`;
  useEffect(() => {
    getRcepNo();
  }, []);
  return (
    <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button
          padding={2}
          variant="ghost"
          w="10%"
          aria-label="재무제표 보기"
          background="none"
          _hover={{ background: "none" }}
          marginTop="-8px"
          marginLeft="-6px"
        >
          <FiExternalLink />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="80vw" maxH="80vh" p={0} overflow="hidden">
            <Dialog.Header p={4} display="flex" alignItems="center">
              <Dialog.Title>재무제표</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body p={0} h="calc(80vh - 48px)">
              <iframe
                src={link}
                title="Naver"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default OpenDart;
