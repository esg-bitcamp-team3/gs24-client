import {Box, Flex, Separator, Spinner, Text} from '@chakra-ui/react'

import {Table} from '@chakra-ui/react'
import React from 'react'

const items = [
  {id: 1, name: '제조업', category: '삼성전자', category1: 'SK하이닉스'},
  {id: 2, name: '은행', category: 'NH 농협은행', category1: 'KB국민은행'},
  {id: 3, name: '소비재', category: 'LG 생활건강', category1: 'CJ제일제당'},
  {id: 4, name: 'IT서비스', category: '삼성SDS', category1: '네이버'},
  {id: 5, name: '유통물류', category: '신세계', category1: '이마트'}
]

const CorpRankByIndustry = () => {
  return (
    <Box p={5} borderRadius="lg" boxShadow="lg" w="5xl" h="300px" backgroundColor="white">
      <Text fontSize="lg" fontWeight="bold" alignSelf="flex-start" mb={3}>
        업종별 등급 랭킹
      </Text>
      <Separator variant="solid" size="lg" padding={1} w="full" />
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
              업종
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
              1위
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2} fontWeight="bold" textAlign="center">
              2위
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map(item => (
            <Table.Row key={item.id}>
              <Table.Cell p={2} textAlign="center">
                {item.name}
              </Table.Cell>
              <Table.Cell p={2} textAlign="center">
                {item.category}
              </Table.Cell>
              <Table.Cell p={2} textAlign="center">
                {item.category1}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
export default CorpRankByIndustry
