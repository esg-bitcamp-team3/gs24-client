'use client'

import {Flex, Button, Icon, Text} from '@chakra-ui/react'
import {useParams, useRouter, usePathname} from 'next/navigation'
import {FaRegBuilding} from 'react-icons/fa'
import {LuEarth, LuNewspaper} from 'react-icons/lu'

export default function SideBar() {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const companyId = params?.id

  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  return (
    <Flex
      position="fixed"
      top="65px"
      left={0}
      w="250px"
      h="calc(100vh - 65px)"
      bg="#ffffff"
      px={4}
      py={6}
      zIndex={100}
      direction="column">
      <Flex gap={4} direction="column" width="100%">
        <Button
          variant="ghost"
          color={isActive('companyInfo') ? "blue.500" : "black"}
          justifyContent="flex-start"
          bg={isActive('companyInfo') ? "blue.50" : "transparent"}
          _hover={{
            bg: "blue.50",
            color: "blue.500"
          }}
          onClick={() => router.push(`/dashboard/${companyId}/companyInfo`)}>
          <Text fontSize="lg" fontWeight="bold">
            <Icon as={FaRegBuilding} boxSize={5} mr={2} />
            기업정보
          </Text>
        </Button>

        <Button
          variant="ghost"
          color={isActive('esgAnalysis') ? "blue.500" : "black"}
          justifyContent="flex-start"
          bg={isActive('esgAnalysis') ? "blue.50" : "transparent"}
          _hover={{
            bg: "blue.50",
            color: "blue.500"
          }}
          onClick={() => router.push(`/dashboard/${companyId}/esgAnalysis`)}>
          <Text fontSize="lg" fontWeight="bold">
            <Icon as={LuEarth} boxSize={5} mr={2} />
            ESG 분석
          </Text>
        </Button>

        <Button
          variant="ghost"
          color={isActive('keyword-trend') ? "blue.500" : "black"}
          justifyContent="flex-start"
          bg={isActive('keyword-trend') ? "blue.50" : "transparent"}
          _hover={{
            bg: "blue.50",
            color: "blue.500"
          }}
          onClick={() => router.push(`/dashboard/${companyId}/keyword-trend`)}>
          <Text fontSize="lg" fontWeight="bold">
            <Icon as={LuNewspaper} boxSize={5} mr={2} />
            키워드 트렌드
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}