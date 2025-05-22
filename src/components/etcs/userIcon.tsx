import { Avatar, Box } from "@chakra-ui/react";

import { Button, Menu, Portal } from "@chakra-ui/react";

const Icon = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button size="sm">
          <Avatar.Root
            shape="full"
            size="lg"
            style={{
              border: "2px solid #ccc", // 테두리 색과 두께 설정
              padding: "2px", // 테두리 안쪽 여백 (선택 사항)
              borderRadius: "50%", // 원형 테두리를 유지
            }}
          >
            <Avatar.Fallback name="Segun Adebayo" />
            <Avatar.Image src="/user.png" />
            <Icon />
          </Avatar.Root>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New Text File</Menu.Item>
            <Menu.Item value="new-file">New File...</Menu.Item>
            <Menu.Item value="new-win">New Window</Menu.Item>
            <Menu.Item value="open-file">Open File...</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

const UserIcon = () => {
  return (
    <Box
      position="absolute"
      top="16px"
      right="16px"
      margin="16px"
      cursor="pointer"
      zIndex={1000}
    >
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button size="sm">
            <Avatar.Root
              shape="full"
              size="lg"
              style={{
                border: "2px solid #ccc", // 테두리 색과 두께 설정
                padding: "2px", // 테두리 안쪽 여백 (선택 사항)
                borderRadius: "50%", // 원형 테두리를 유지
              }}
            >
              <Avatar.Fallback name="Segun Adebayo" />
              <Avatar.Image src="/user.png" />
              <Icon />
            </Avatar.Root>
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-txt">New Text File</Menu.Item>
              <Menu.Item value="new-file">New File...</Menu.Item>
              <Menu.Item value="new-win">New Window</Menu.Item>
              <Menu.Item value="open-file">Open File...</Menu.Item>
              <Menu.Item value="export">Export</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      {/* <Avatar.Root
        shape="full"
        size="lg"
        style={{
          border: "2px solid #ccc", // 테두리 색과 두께 설정
          padding: "2px", // 테두리 안쪽 여백 (선택 사항)
          borderRadius: "50%", // 원형 테두리를 유지
        }}
      >
        <Avatar.Fallback name="Segun Adebayo" />
        <Avatar.Image src="/user.png" />
        <Icon />
      </Avatar.Root> */}
    </Box>
  );
};
export default UserIcon;
