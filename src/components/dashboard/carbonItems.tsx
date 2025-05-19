import { Box, Separator, Spinner, Text } from "@chakra-ui/react";

import axios from "axios";
import { Table } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

interface CarbonItem {
  id: number;
  date: string;
  item_name: string;
  price: string;
  compare: string;
  percent: string;
  volume: string;
  total_value: string;
}

const CarbonItemsChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [carbonitems, setCarbonItems] = useState<CarbonItem[]>([]);

  const [carbonitems1, setCarbonItems1] = useState<CarbonItem[]>([]);
  const today = 20250508;
  const yesterday = 20250507;
  // const formatDate = (date: Date): string => {
  //   const year = date.getFullYear()
  //   const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
  //   const day = String(date.getDate()).padStart(2, '0')

  //   return `${year}${month}${day}`
  // }

  // const today = new Date()
  // const formatted = formatDate(today)
  // const yesterdayDate = new Date(today)
  // yesterdayDate.setDate(today.getDate() - 1)
  // const yesterday = formatDate(yesterdayDate)

  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        const res2 = await axios.get(
          `http://localhost:8000/api/market-price/carbon-price?basDt=${today}&itmsNm=KAU24`
        );
        const res1 = await axios.get(
          `http://localhost:8000/api/market-price/carbon-price?basDt=${yesterday}&itmsNm=KAU24`
        );

        const transformData = (
          data: {
            basDt: string | any[];
            itmsNm: any;
            clpr: any;
            vs: any;
            fltRt: any;
            trqu: any;
            trPrc: any;
          }[]
        ) =>
          data.map(
            (
              item: {
                basDt: string | any[];
                itmsNm: any;
                clpr: any;
                vs: any;
                fltRt: any;
                trqu: any;
                trPrc: any;
              },
              index: number
            ) => ({
              id: index + 1,
              date: `${item.basDt.slice(0, 4)}/${item.basDt.slice(
                4,
                6
              )}/${item.basDt.slice(6, 8)}`,
              item_name: item.itmsNm,
              price: item.clpr,
              compare: item.vs,
              percent: item.fltRt,
              volume: item.trqu,
              total_value: item.trPrc,
            })
          );

        const mergedData = [
          ...transformData(res2.data),
          ...transformData(res1.data),
        ];
        setCarbonItems(mergedData);
      } catch (err) {
        console.error("탄소 데이터 요청 오류:", err);
        setError("탄소 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarbonData();
  }, []);
  return (
    <Box
      overflowY="auto"
      p={5}
      borderRadius="lg"
      boxShadow="lg"
      width="full"
      maxHeight="170px"
      backgroundColor="white"
    >
      <Box position="sticky" top={0} zIndex={1} backgroundColor="white" p={5}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          탄소 배출권 시세
        </Text>
        <Separator size="lg" padding={1} w="full" />
      </Box>

      <Separator size="lg" padding={1} w="full" />
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textAlign="center">날짜</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">종목명</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">종가</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">대비</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">
              등락율(%)
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">거래량</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">거래대금</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        {loading ? (
          <Spinner />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <Table.Body>
            {carbonitems1.map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell textAlign="center">{item.date}</Table.Cell>

                <Table.Cell textAlign="center">{item.item_name}</Table.Cell>
                <Table.Cell textAlign="center">{item.price}</Table.Cell>
                <Table.Cell textAlign="center">{item.compare}</Table.Cell>
                <Table.Cell textAlign="center">{item.percent}</Table.Cell>
                <Table.Cell textAlign="center">{item.volume}</Table.Cell>
                <Table.Cell textAlign="center">{item.total_value}</Table.Cell>
              </Table.Row>
            ))}
            {carbonitems.map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell textAlign="center">{item.date}</Table.Cell>
                <Table.Cell textAlign="center">{item.item_name}</Table.Cell>
                <Table.Cell textAlign="center">{item.price}</Table.Cell>
                <Table.Cell textAlign="center">{item.compare}</Table.Cell>
                <Table.Cell textAlign="center">{item.percent}</Table.Cell>
                <Table.Cell textAlign="center">{item.volume}</Table.Cell>
                <Table.Cell textAlign="center">{item.total_value}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table.Root>
    </Box>
  );
};

export default CarbonItemsChart;
