import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useRef } from "react";
import { useState } from "react";

export default function AddCategory({
  onSave,
}: {
  onSave: (categoryName: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setCategoryName("");
  };

  return (
    <Dialog.Root initialFocusEl={() => ref.current}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          size="lg"
          colorScheme="teal"
          px={4}
          py={4}
          fontWeight="bold"
          fontSize="xl"
          borderRadius="lg"
          boxShadow="md"
          onClick={() => setOpen(true)}
        >
          +
        </Button>
      </Dialog.Trigger>
      {open && (
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.400" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="sm"
              borderRadius="2xl"
              boxShadow="2xl"
              p={8}
              bg="white"
            >
              <Dialog.Header mb={2}>
                <Dialog.Title fontSize="2xl" fontWeight="bold">
                  새 카테고리 생성
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="6">
                <Stack gap="6">
                  <Field.Root>
                    <Field.Label fontWeight="semibold" mb={2} color="gray.600">
                      카테고리 이름
                    </Field.Label>
                    <Input
                      ref={ref}
                      placeholder="  ex) IT"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      size="lg"
                      borderRadius="md"
                      borderColor="black"
                    />
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer
                mt={4}
                display="flex"
                justifyContent="flex-end"
                gap={3}
              >
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="ghost"
                    size="md"
                    borderRadius="md"
                    _hover={{
                      bg: "gray.200",
                    }}
                    onClick={handleClose}
                  >
                    취소
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  variant="solid"
                  size="md"
                  borderRadius="md"
                  fontWeight="semibold"
                  bg="white"
                  color="black"
                  _hover={{
                    bg: "gray.200",
                  }}
                  onClick={async () => {
                    if (!categoryName.trim()) {
                      alert("카테고리 이름을 입력하세요.");
                      return;
                    }
                    try {
                      await onSave(categoryName);
                      handleClose();
                    } catch (e) {
                      alert("카테고리 등록에 실패했습니다.");
                    }
                  }}
                >
                  생성
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      )}
    </Dialog.Root>
  );
}
