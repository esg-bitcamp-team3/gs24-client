// components/InfoItem.tsx
import { Flex, Text, Link, Skeleton } from "@chakra-ui/react";
import { GridItem, GridItemProps } from "@chakra-ui/react";
import React from "react";

interface InfoItemProps extends GridItemProps {
  label: string;
  value: React.ReactNode;
  href?: string;
  isLoading?: boolean;
  valueColor?: string;
}

export const InfoItemDart = ({
  label,
  value,
  href,
  isLoading = false,
  valueColor,
  ...gridProps
}: InfoItemProps) => (
  <GridItem {...gridProps}>
    <Flex direction="row" gap={1}>
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
        <>{value || "-"}</>
      )}
    </Flex>
  </GridItem>
);
