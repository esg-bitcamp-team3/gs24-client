import { postCategory } from "@/lib/api/post";
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

  return (
    <Dialog.Root initialFocusEl={() => ref.current}>
      <Dialog.Trigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          +
        </Button>
      </Dialog.Trigger>
      <>
        {open && (
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>새 카테고리 생성</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body pb="4">
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>카테고리 이름</Field.Label>
                      <Input
                        ref={ref}
                        placeholder="ex) IT"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                    </Field.Root>
                  </Stack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button
                    onClick={async () => {
                      if (!categoryName.trim()) {
                        alert("카테고리 이름을 입력하세요.");
                        return;
                      }
                      try {
                        await onSave(categoryName);
                        setOpen(false);
                      } catch (e) {
                        alert("카테고리 등록에 실패했습니다.");
                      }
                    }}
                  >
                    Save
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        )}
      </>
    </Dialog.Root>
  );
}
