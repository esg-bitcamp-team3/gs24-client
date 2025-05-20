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
            <Dialog.Body>
              <Box>
                <Input
                  placeholder="그룹 이름을 입력하세요"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={() => {
                  addCategory();
                  setIsOpen(false);
                }}
              >
                등록
              </Button>
              <Button
                variant="outline"
                marginTop={3}
                padding={3}
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default CategoryDialog;
