'use client'

import {Flex, Button, Icon, Text} from '@chakra-ui/react'
import {useParams, useRouter} from 'next/navigation'
import {FaRegBuilding} from 'react-icons/fa'
import {LuEarth, LuNewspaper} from 'react-icons/lu'

export default function SideBar() {
  const router = useRouter()
  const params = useParams()
  const companyId = params?.id

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
          color="black"
          justifyContent="flex-start"
          onClick={() => router.push(`/dashboard/${companyId}/companyInfo`)}>
          <Text fontSize="lg" fontWeight="bold">
            <Icon as={FaRegBuilding} boxSize={5} mr={2} />
            기업정보
          </Text>
        </Button>

        <Button
          variant="ghost"
          color="black"
          justifyContent="flex-start"
          onClick={() => router.push(`/dashboard/${companyId}/esgAnalysis`)}>
          <Text fontSize="lg" fontWeight="bold">
            <Icon as={LuEarth} boxSize={5} mr={2} />
            ESG 분석
          </Text>
        </Button>

        <Button
          variant="ghost"
          color="black"
          justifyContent="flex-start"
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
