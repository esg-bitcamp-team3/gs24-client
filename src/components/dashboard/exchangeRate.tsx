import {Box, Spinner, Text} from '@chakra-ui/react'

import axios from 'axios'
import React, {useState, useEffect, use} from 'react'

import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

interface ExchangeRateItem {
  date: string
  rate: number
}

const useExchangeRateHistory = () => {
  const [data, setData] = useState<ExchangeRateItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/market-price/exchange-rate`
        )
        const rawData = res.data

        const parsed = rawData
          .map((entry: any) => {
            const usd = entry.data.find((d: any) => d.cur_unit === 'USD')
            if (!usd || !usd.deal_bas_r) return null

            return {
              date: entry.date,
              rate: parseFloat(usd.deal_bas_r.replace(',', ''))
            }
          })
          .filter(Boolean) // null 제거

        setData(parsed.reverse()) // 최신 → 오래된 순서로 정렬
      } catch (err: any) {
        console.error('환율 불러오기 실패:', err)
        setError('환율 데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return {data, loading, error}
}

// ==============================
// 환율 박스 컴포넌트
// ==============================
const ExchangeRateChart = () => {
  const {data, loading, error} = useExchangeRateHistory()

  return (
    <Box p={4} bg="white" borderRadius="lg" shadow="md" w="full" h="300px">
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        최근 5일 USD → KRW 환율
      </Text>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#3182ce" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  )
}

export default ExchangeRateChart
