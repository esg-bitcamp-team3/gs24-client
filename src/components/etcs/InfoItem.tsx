// components/InfoItem.tsx
import { Flex, Text, Link, Skeleton } from "@chakra-ui/react";
import { GridItem, GridItemProps } from "@chakra-ui/react";

interface InfoItemProps extends GridItemProps {
  label: string;
  value?: string | number;
  href?: string;
  isLoading?: boolean;
  valueColor?: string;
}

export const InfoItem = ({
  label,
  value,
  href,
  isLoading = false,
  valueColor,
  ...gridProps
}: InfoItemProps) => (
  <GridItem {...gridProps}>
    <Flex direction="column" gap={1}>
      <Text fontSize="sm" fontWeight="medium" color="gray.600">
        {label}
      </Text>
      {isLoading ? (
        <Skeleton height="20px" width="80%" />
      ) : href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          fontSize="md"
          fontWeight="500"
          color={valueColor || "blue.500"}
        >
          {value || "-"}
        </Link>
      ) : (
        <Text fontSize="md" fontWeight="500" color={valueColor || "gray.800"}>
          {value || "-"}
        </Text>
      )}
    </Flex>
  </GridItem>
);
