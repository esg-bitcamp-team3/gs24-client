import {Box, Flex, Separator, Spinner, Text} from '@chakra-ui/react'
import {Table} from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import {GoPlus} from 'react-icons/go'
import Link from 'next/link'
import {getInterestCompanyInfo, getOrganizationRank} from '@/lib/api/get'
import SearchOrg from '@/components/navbar/SearchOrg'
import {InterestCompanyInfo} from '@/lib/api/interfaces/companyinfo'

const InterestCopList = () => {
  const [companyinfo, setCompanyInfo] = useState<InterestCompanyInfo[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyInfoData = await getInterestCompanyInfo()
        setCompanyInfo(companyInfoData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
  return (
    <Flex flexDirection="column" gap={4} width="full">
      <Box
        p={5}
        borderRadius="lg"
        boxShadow="lg"
        w="5xl"
        h="300px"
        backgroundColor="white">
        <Flex justifyContent="space-between">
          <Text fontSize="lg" fontWeight="bold">
            관심 기업 리스트
          </Text>

          <Box>
            <SearchOrg
              label={
                <>
                  <GoPlus />
                  기업추가
                </>
              }
            />
          </Box>
        </Flex>
        <Separator variant="solid" size="lg" padding={1} w="full" />
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
                기업명
              </Table.ColumnHeader>
              <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
                업종
              </Table.ColumnHeader>
              <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
                매출(만원)
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {companyinfo &&
              companyinfo.map((likeitems, index) => (
                <Table.Row key={index}>
                  <Table.Cell p={2} textAlign="center">
                    <Link
                      href={`/dashboard/companyInfo/${likeitems.interestOrganization.organizationId}`}>
                      {likeitems.companyInfo.companyName}
                    </Link>
                  </Table.Cell>

                  <Table.Cell p={2} textAlign="center">
                    {likeitems.companyInfo.industry}
                  </Table.Cell>
                  <Table.Cell p={2} textAlign="center">
                    {likeitems.companyInfo.capital}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Flex>
  )
}
export default InterestCopList
