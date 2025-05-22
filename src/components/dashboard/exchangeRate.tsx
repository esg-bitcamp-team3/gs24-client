import { Box, HStack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { marketApi } from "@/lib/api/apiclient";

const MotionBox = motion(Box);

interface ExchangeRateItem {
  date: string;
  rate: number;
}

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

const Ticker = () => {
  const [showCarbon, setShowCarbon] = useState(false);
  const [exchangeToday, setExchangeToday] = useState<ExchangeRateItem | null>(
    null
  );
  const [exchangePrev, setExchangePrev] = useState<ExchangeRateItem | null>(
    null
  );
  const [carbonToday, setCarbonToday] = useState<CarbonItem | null>(null);

  // 롤링
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCarbon((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ 실제 탄소 데이터 가져오기
  const getPreviousBusinessDay = (): string => {
    const date = new Date();
    const day = date.getDay();

    if (day === 1) {
      // 월요일이면 금요일 (3일 전)
      date.setDate(date.getDate() - 3);
    } else if (day === 0) {
      // 일요일이면 금요일 (2일 전)
      date.setDate(date.getDate() - 2);
    } else if (day === 6) {
      // 토요일이면 금요일 (1일 전)
      date.setDate(date.getDate() - 1);
    } else {
      // 화~금은 전날
      date.setDate(date.getDate() - 1);
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
  };
  // ✅ 환율 실제 데이터 호출로 교체
  useEffect(() => {
    const fetchExchangeData = async () => {
      try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}${mm}${dd}`;

        const res = await marketApi.get(`/exchange-rate?date=${dateStr}`);

        const data = res.data; // [{ date: '2025-05-20', data: [ {...USD...} ] }, ...]
        if (Array.isArray(data) && data.length >= 2) {
          const extractUSD = (entry: any) =>
            entry.data.find((d: any) => d.cur_unit === "USD" && d.deal_bas_r);

          const usdToday = extractUSD(data[0]);
          const usdPrev = extractUSD(data[1]);

          if (usdToday && usdPrev) {
            setExchangeToday({
              date: data[0].date,
              rate: parseFloat(usdToday.deal_bas_r.replace(",", "")),
            });
            setExchangePrev({
              date: data[1].date,
              rate: parseFloat(usdPrev.deal_bas_r.replace(",", "")),
            });
          }
        }
      } catch (err) {
        console.error("환율 데이터 요청 실패:", err);
      }
    };

    fetchExchangeData();
  }, []);

  useEffect(() => {
    const fetchCarbonData = async () => {
      const basDt = getPreviousBusinessDay(); // 💡 요일 고려된 날짜 계산

      try {
        const res = await marketApi.get(`/carbon-price`);

        const item = res.data[0];
        if (item) {
          const formatted: CarbonItem = {
            id: 1,
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
          };
          setCarbonToday(formatted);
        }
      } catch (err) {
        console.error("탄소 데이터 요청 실패:", err);
      }
    };

    fetchCarbonData();
  }, []);
  const getExchangeDiff = (curr: number, prev: number) => {
    const diff = curr - prev;
    const percent = ((diff / prev) * 100).toFixed(2);
    return { diff: diff.toFixed(2), percent };
  };

  const renderExchange = () => {
    if (!exchangeToday || !exchangePrev) return <Text>환율 데이터 없음</Text>;
    const { diff, percent } = getExchangeDiff(
      exchangeToday.rate,
      exchangePrev.rate
    );
    const isUp = parseFloat(diff) > 0;

    return (
      <HStack justify="space-between" align="center" px={10}>
        <HStack gap={4} align="start">
          <Text fontSize="md" fontWeight="semibold">
            {exchangeToday.date.slice(-4).replace(/(\d{2})(\d{2})/, "$1/$2")}.
          </Text>
          <Text fontSize="md" fontWeight="semibold" color="gray.600">
            USD/KRW
          </Text>
        </HStack>
        <Text fontWeight="bold">{exchangeToday.rate.toLocaleString()}</Text>
        <Text color={isUp ? "red.500" : "blue.500"}>
          {Math.abs(Number(diff)).toFixed(2)} {isUp ? "▲" : "▼"}
        </Text>
      </HStack>
    );
  };

  const renderCarbon = () => {
    if (!carbonToday) return <Text>카본 데이터 없음</Text>;
    const isUp = parseFloat(carbonToday.compare) > 0;

    return (
      <HStack justify="flex-start" align="start" gap={2}>
        <HStack gap={4} align="start">
          <Text fontSize="md" fontWeight="semibold">
            {carbonToday.date.slice(5).replace(/-/g, ".")}.
          </Text>
          <Text fontSize="md" fontWeight="semibold" color="gray.600">
            배출권시세
          </Text>
        </HStack>
        <Text fontWeight="bold">
          {Number(carbonToday.price).toLocaleString()}￦
        </Text>
        <Text color={isUp ? "red.500" : "blue.500"}>
          {Math.abs(Number(carbonToday.compare)).toFixed(2)} {isUp ? "▲" : "▼"}
        </Text>
      </HStack>
    );
  };

  return (
    <Box
      p={0}
      bg="white"
      width="100%"
      maxW="360px"
      h="60px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      <AnimatePresence mode="wait">
        <MotionBox
          key={showCarbon ? "carbon" : "exchange"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          width="100%"
        >
          {showCarbon ? renderCarbon() : renderExchange()}
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default Ticker;
