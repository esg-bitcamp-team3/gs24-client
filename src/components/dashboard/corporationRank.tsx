import {Box, Separator, Text} from '@chakra-ui/react'

import {Table} from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import {getOrganizationRank} from '@/lib/api/get'
import {OrganizationRank} from '@/lib/api/interfaces/interestOrganization'

const CorporateRank = () => {
  const [organizationRank, setOrganizationRank] = useState<OrganizationRank[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orData = await getOrganizationRank()
        if (orData) setOrganizationRank(orData || [])
        else return null
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <Box
      p={5}
      borderRadius="lg"
      boxShadow="lg"
      width="full"
      height="450px"
      backgroundColor="white">
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        올해등급별 기업랭킹
      </Text>
      <Separator size="lg" padding={1} w="full" />
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
              {' '}
              순위
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
              기업명
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
              등급
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
              점수
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body scrollBehavior={'smooth'}>
          {organizationRank &&
            organizationRank.map((rankitems, index) => (
              <Table.Row key={index}>
                <Table.Cell p={2} textAlign="center">
                  {index + 1}
                </Table.Cell>
                <Table.Cell p={2} textAlign="center">
                  {rankitems.organizationName}
                </Table.Cell>
                <Table.Cell p={2} textAlign="center">
                  {rankitems.esgGrade}
                </Table.Cell>
                <Table.Cell p={2} textAlign="center">
                  {rankitems.esgScore}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
export default CorporateRank
