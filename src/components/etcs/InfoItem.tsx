// components/InfoItem.tsx
import { Flex, Text, Link } from "@chakra-ui/react";

interface InfoItemProps {
  label: string;
  value?: string | number;
  href?: string;
}

export const InfoItem = ({ label, value, href }: InfoItemProps) => (
  <Flex direction={{ base: "column", md: "row" }} align="start" gap={4}>
    <Text fontSize="md" color="gray.600" minW={{ base: "auto", md: "100px" }}>
      {label}
    </Text>
    {href ? (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        fontSize="md"
        color="blue.500"
      >
        {value || "-"}
      </Link>
    ) : (
      <Text fontSize="md" fontWeight="500">
        {value || "-"}
      </Text>
    )}
  </Flex>
);
