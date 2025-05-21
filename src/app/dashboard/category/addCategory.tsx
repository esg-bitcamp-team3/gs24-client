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
                <Dialog.Title
                  fontSize="2xl"
                  fontWeight="bold"
                  color="green.700"
                >
                  새 카테고리 생성
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="6">
                <Stack gap="6">
                  <Field.Root>
                    <Field.Label fontWeight="semibold" mb={2}>
                      카테고리 이름
                    </Field.Label>
                    <Input
                      ref={ref}
                      placeholder="  ex) IT"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      size="lg"
                      borderRadius="md"
                      borderColor="green.400"
                      _focus={{
                        borderColor: "green.500",
                        boxShadow: "0 0 0 2px rgb(45, 177, 159)",
                      }}
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
                    colorScheme="gray"
                    size="md"
                    borderRadius="md"
                    onClick={handleClose}
                  >
                    취소
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorScheme="teal"
                  variant="solid"
                  size="md"
                  borderRadius="md"
                  fontWeight="semibold"
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
