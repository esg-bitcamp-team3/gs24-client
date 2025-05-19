import {Box, Flex, Text, VStack} from '@chakra-ui/react'

const ESGRatings = () => {
  return (
    <Box p={3} borderRadius="lg" boxShadow="lg" w="md">
      <VStack align="center" px="6" width="full" height="full">
        <Flex w="full">
          <Text fontSize="lg" fontWeight="bold" textAlign="start">
            LG
          </Text>
        </Flex>
      </VStack>
    </Box>
  )
}

export default ESGRatings
