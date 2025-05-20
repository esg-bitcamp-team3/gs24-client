import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, Flex, HStack, RadioCard, Spinner, Text } from "@chakra-ui/react";
import { searchApi } from "@/lib/api/apiclient";

type DataPoint = {
  period: string;
  ratio: number;
};

type KeywordData = {
  title: string;
  keywords: string[];
  data: DataPoint[];
};

type TimeRange = "3M" | "6M" | "1Y";
type TimeUnit = "day" | "week" | "month";

type Props = {
  data: DataPoint[];
  width?: number;
  height?: number;
  timeUnit?: TimeUnit;
};

const MentionTrendChart = ({
  data,
  width = 600,
  height = 300,
  timeUnit,
}: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [chartWidth, setChartWidth] = useState(width);

  const lineColor = "#4299E1"; // Blue 500
  const gridColor = "#E2E8F0"; // Gray 200
  const tooltipBg = "#FFFFFF"; // White
  const tooltipColor = "#1A202C"; // Gray 800
  const tooltipBorderColor = "#E2E8F0"; // Gray 200

  // Calculate responsive width based on container
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setChartWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // svg 설정
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 초기화

    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 날짜 파싱
    const parseDate = d3.timeParse("%Y-%m-%d");
    const parsedData = data.map((d) => ({
      period: parseDate(d.period) as Date,
      ratio: d.ratio,
    }));

    // x, y 스케일
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.period) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(d3.max(parsedData, (d) => d.ratio) || 0) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // 컨테이너 생성
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 그리드 라인
    chart
      .append("g")
      .attr("class", "grid-lines")
      .selectAll("line.horizontal-grid")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "horizontal-grid")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", gridColor)
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "3,3");

    // 축 생성
    const formatTick = (date: Date) => {
      if (timeUnit === "day") return d3.timeFormat("%m/%d")(date);
      if (timeUnit === "week") return d3.timeFormat("%m/%d")(date);
      return d3.timeFormat("%Y-%m")(date);
    };

    const xAxis = d3
      .axisBottom<Date>(xScale)
      .ticks(getTickCount(timeUnit || "month", parsedData.length))
      .tickFormat((d) => formatTick(d));

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => `${d}%`);

    // 축 그리기
    chart
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .attr("class", "x-axis")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end")
      .style("font-size", "11px")
      .style("fill", "gray.800");

    chart
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", "gray.800");

    // 영역 채우기
    const area = d3
      .area<{ period: Date; ratio: number }>()
      .x((d) => xScale(d.period))
      .y0(innerHeight)
      .y1((d) => yScale(d.ratio))
      .curve(d3.curveMonotoneX);

    chart
      .append("path")
      .datum(parsedData)
      .attr("fill", `${lineColor}20`) // 20% opacity
      .attr("d", area);

    // 라인 생성기
    const line = d3
      .line<{ period: Date; ratio: number }>()
      .x((d) => xScale(d.period))
      .y((d) => yScale(d.ratio))
      .curve(d3.curveMonotoneX);

    // 라인 그리기
    chart
      .append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // 툴팁 생성
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "trend-chart-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", tooltipBg)
      .style("color", tooltipColor)
      .style("border", `1px solid ${tooltipBorderColor}`)
      .style("border-radius", "6px")
      .style("padding", "8px 12px")
      .style("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.15)")
      .style("pointer-events", "none")
      .style("z-index", 1000)
      .style("font-size", "12px")
      .style("max-width", "200px");

    // 포인트 표시 (원)
    chart
      .selectAll(".dot")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.period))
      .attr("cy", (d) => yScale(d.ratio))
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 7)
          .attr("fill", lineColor)
          .attr("stroke-width", 0);

        const formattedDate = d3.timeFormat("%Y년 %m월 %d일")(d.period);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${formattedDate}</strong><br>언급률: ${d.ratio.toFixed(
              2
            )}%`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 5)
          .attr("fill", "white")
          .attr("stroke", lineColor)
          .attr("stroke-width", 2);

        tooltip.style("visibility", "hidden");
      });

    // Cleanup tooltip when component unmounts
    return () => {
      d3.select(".trend-chart-tooltip").remove();
    };
  }, [
    data,
    chartWidth,
    height,
    lineColor,
    gridColor,
    tooltipBg,
    tooltipColor,
    tooltipBorderColor,
    timeUnit,
  ]);

  // Helper to determine tick count based on time unit and data length
  const getTickCount = (unit: TimeUnit, dataLength: number): number => {
    if (dataLength <= 5) return dataLength;
    if (unit === "day") return Math.min(10, dataLength);
    if (unit === "week") return Math.min(8, dataLength);
    return Math.min(6, dataLength);
  };

  return (
    <Box ref={containerRef} width="100%" height={height}>
      <svg ref={svgRef} width="100%" height={height}></svg>
    </Box>
  );
};

const timeRangeItems = [
  { label: "3개월", value: "3M" },
  { label: "6개월", value: "6M" },
  { label: "1년", value: "1Y" },
];

const timeUnitItems = [
  { label: "일", value: "day" },
  { label: "주", value: "week" },
  { label: "월", value: "month" },
];

const CorpTrendCard = ({ corpName }: { corpName: string }) => {
  const [trendData, setTrendData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("month");

  // Date range calculation helper
  type TimeRange = "3M" | "6M" | "1Y" | "ALL";
  type TimeUnit = "day" | "week" | "month";
  const getDateRange = (
    range: TimeRange
  ): { startDate: string; endDate: string } => {
    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case "3M": // 3개월
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6M": // 6개월
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1Y": // 1년
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "ALL": // 전체
        startDate.setFullYear(endDate.getFullYear() - 5); // Default to 5 years for "ALL"
        break;
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { startDate, endDate } = getDateRange(timeRange);

        // const response = await searchApi.get(
        //   `/keyword-data?query=${encodeURIComponent(
        //     corpName
        //   )}&keywords=${encodeURIComponent(
        //     corpName
        //   )}&start_date=${startDate}&end_date=${endDate}&time_unit=${timeUnit}`
        // );
        // console.log("API Response:", response);
        // if (!(response.status === 200))
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // const data: KeywordData[] = response.data;

        const response = await fetch(
          `http://localhost/search/search/keyword-data?query=${encodeURIComponent(
            corpName
          )}&keywords=${encodeURIComponent(
            corpName
          )}&start_date=${startDate}&end_date=${endDate}&time_unit=${timeUnit}`
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data: KeywordData[] = await response.json();

        console.log("Fetched data:", data);

        if (data.length > 0) {
          setTrendData(data[0].data);
        } else {
          setTrendData([]);
        }
      } catch (error: any) {
        setError(error.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [corpName, timeRange, timeUnit]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range as TimeRange);
  };

  const handleTimeUnitChange = (unit: string) => {
    setTimeUnit(unit as TimeUnit);
  };

  return (
    <Box p={4} pt={5}>
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
        mb={4}
      >
        <Flex
          gap={4}
          justifyContent={"end"}
          flexDirection={{ base: "column", sm: "row" }}
          width={{ base: "100%", md: "auto" }}
        >
          <Box>
            <RadioCard.Root
              onValueChange={(e) => handleTimeRangeChange(e.value || "6M")}
              orientation="horizontal"
              align="center"
              justify="center"
              maxW="lg"
              minW="2xs"
              variant="solid"
              defaultValue="6M"
            >
              <RadioCard.Label>
                <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">
                  기간
                </Text>
              </RadioCard.Label>
              <HStack align="stretch">
                {timeRangeItems.map((item) => (
                  <RadioCard.Item key={item.value} value={item.value} px={4}>
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemText>{item.label}</RadioCard.ItemText>
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </HStack>
            </RadioCard.Root>
          </Box>

          <Box>
            <RadioCard.Root
              onValueChange={(e) => handleTimeUnitChange(e.value || "month")}
              orientation="horizontal"
              align="center"
              justify="center"
              textAlign={"center"}
              maxW="4xs"
              minW="4xs"
              variant="surface"
              defaultValue="month"
            >
              <RadioCard.Label>
                <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">
                  단위
                </Text>
              </RadioCard.Label>
              <HStack align="stretch">
                {timeUnitItems.map((item) => (
                  <RadioCard.Item
                    key={item.value}
                    value={item.value}
                    px={4}
                    textAlign={"center"}
                  >
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemText>{item.label}</RadioCard.ItemText>
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </HStack>
            </RadioCard.Root>
          </Box>
        </Flex>
      </Flex>

      <Box
        borderRadius="md"
        overflow="hidden"
        height="300px"
        borderWidth="1px"
        p={2}
      >
        {loading ? (
          <Flex
            justifyContent="center"
            alignItems="center"
            height="100%"
            mt={6}
          >
            <Spinner size="lg" color="teal.500" borderWidth="3px" />
          </Flex>
        ) : error ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Text color="red.500">Error: {error}</Text>
          </Flex>
        ) : trendData.length === 0 ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Text color="gray.500">데이터가 없습니다</Text>
          </Flex>
        ) : (
          <Box width="100%" height="100%">
            <MentionTrendChart
              data={trendData}
              height={280}
              timeUnit={timeUnit}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CorpTrendCard;
