import { postCatecory } from "@/lib/api/post";
import { Box, Button, Dialog, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";

const CategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");

  const addCategory = async () => {
    try {
      await postCatecory(category);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  return (
    <Dialog.Root open={isOpen} placement="center">
      <Dialog.Trigger asChild onClick={() => setIsOpen(true)}>
        <Button variant="outline" size="sm" padding={3}>
          추가하기
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={4} w="25%">
            <Dialog.Header>
              <Dialog.Title>그룹 추가하기</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body padding={4}>
              <Box>
                <Input
                  placeholder="그룹 이름을 입력하세요"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Box>
            </Dialog.Body>
            <Dialog.Footer
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "24px",
              }}
            >
              <Button
                onClick={() => {
                  addCategory();
                  setIsOpen(false);
                }}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                등록
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                취소
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default CategoryDialog;
