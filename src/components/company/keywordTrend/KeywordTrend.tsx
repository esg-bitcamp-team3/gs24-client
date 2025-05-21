import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  RadioCard,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { searchApi } from "@/lib/api/apiclient";
import { FaSyncAlt } from "react-icons/fa";

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
type TimeUnit = "date" | "week" | "month";

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

    // Add background rectangle for better visual appearance
    chart
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "#f8fafc") // Very light blue-gray
      .attr("rx", 6) // Rounded corners
      .attr("ry", 6);

    // 그리드 라인 (simplified, fewer lines)
    chart
      .append("g")
      .attr("class", "grid-lines")
      .selectAll("line.horizontal-grid")
      .data(yScale.ticks(4)) // Reduced number of grid lines
      .enter()
      .append("line")
      .attr("class", "horizontal-grid")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", gridColor)
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,3"); // Shorter dashes for cleaner look

    // 축 생성
    const formatTick = (date: Date) => {
      if (timeUnit === "date") return d3.timeFormat("%m/%d")(date);
      if (timeUnit === "week") return d3.timeFormat("%m/%d")(date);
      return d3.timeFormat("%Y-%m")(date);
    };

    const xAxis = d3
      .axisBottom<Date>(xScale)
      .ticks(getTickCount(timeUnit || "month", parsedData.length))
      .tickFormat((d) => formatTick(d));

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(4) // Fewer ticks for cleaner look
      .tickFormat((d) => `${d}%`);

    // 축 그리기
    chart
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .attr("class", "x-axis")
      .call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "#cbd5e0")) // Lighter domain line
      .selectAll("text")
      .attr("transform", "rotate(-25)")
      .attr("dy", "0.6em") // Better positioning
      .style("text-anchor", "end")
      .style("font-size", "11px")
      .style("font-weight", "500") // Slightly bolder
      .style("fill", "#64748b"); // Slate 500 - more modern color

    chart
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .call((g) => g.select(".domain").attr("stroke", "#cbd5e0")) // Lighter domain line
      .selectAll("text")
      .style("font-size", "11px")
      .style("font-weight", "500") // Slightly bolder
      .style("fill", "#64748b"); // Slate 500

    // Apply gradient for area fill
    const areaGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    areaGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", `${lineColor}40`); // 40% opacity

    areaGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", `${lineColor}05`); // 5% opacity

    // 영역 채우기
    const area = d3
      .area<{ period: Date; ratio: number }>()
      .x((d) => xScale(d.period))
      .y0(innerHeight)
      .y1((d) => yScale(d.ratio))
      .curve(d3.curveCatmullRom.alpha(0.5)); // Smoother curve

    chart
      .append("path")
      .datum(parsedData)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    // 라인 생성기
    const line = d3
      .line<{ period: Date; ratio: number }>()
      .x((d) => xScale(d.period))
      .y((d) => yScale(d.ratio))
      .curve(d3.curveCatmullRom.alpha(0.5)); // Smoother curve

    // Add animated line
    const path = chart
      .append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round") // Rounded line ends
      .attr("stroke-linejoin", "round") // Rounded line joins
      .attr("d", line);

    // Animate the line drawing
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    // Calculate average ratio
    const avgRatio = d3.mean(parsedData, (d) => d.ratio) || 0;

    // Add average line
    chart
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(avgRatio))
      .attr("y2", yScale(avgRatio))
      .attr("stroke", "#94a3b8") // Slate 400
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .style("opacity", 0) // Start invisible
      .transition()
      .delay(1500)
      .duration(500)
      .style("opacity", 0.7); // Fade in

    // Enhanced tooltip with better styling
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "trend-chart-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", tooltipBg)
      .style("color", tooltipColor)
      .style("border", `1px solid ${tooltipBorderColor}`)
      .style("border-radius", "8px")
      .style("padding", "10px 14px")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.08)")
      .style("pointer-events", "none")
      .style("z-index", 1000)
      .style("font-size", "12px")
      .style("max-width", "200px")
      .style("transition", "opacity 0.2s")
      .style("opacity", 0);

    // Add highlight line for tooltip
    const tooltipLine = chart
      .append("line")
      .attr("class", "tooltip-line")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "#94a3b8") // Slate 400
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Highlight latest data point
    // const latestData = parsedData[parsedData.length - 1];
    // chart
    //   .append("circle")
    //   .attr("cx", xScale(latestData.period))
    //   .attr("cy", yScale(latestData.ratio))
    //   .attr("r", 6)
    //   .attr("fill", lineColor)
    //   .attr("stroke", "white")
    //   .attr("stroke-width", 1.5)
    //   .style("opacity", 0)
    //   .transition()
    //   .delay(1800)
    //   .duration(300)
    //   .style("opacity", 1);

    // // Add latest value callout
    // const callout = chart
    //   .append("g")
    //   .attr(
    //     "transform",
    //     `translate(${xScale(latestData.period) + 15}, ${
    //       yScale(latestData.ratio) - 10
    //     })`
    //   )
    //   .style("opacity", 0);

    // callout
    //   .append("rect")
    //   .attr("rx", 4)
    //   .attr("ry", 4)
    //   .attr("width", 60)
    //   .attr("height", 20)
    //   .attr("fill", lineColor)
    //   .attr("opacity", 0.9);

    // callout
    //   .append("text")
    //   .attr("x", 30)
    //   .attr("y", 14)
    //   .attr("text-anchor", "middle")
    //   .attr("fill", "white")
    //   .attr("font-size", "10px")
    //   .attr("font-weight", "bold")
    //   .text(`${latestData.ratio.toFixed(1)}%`);

    // callout.transition().delay(2000).duration(300).style("opacity", 1);

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
    if (unit === "date") return Math.min(10, dataLength);
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
  { label: "일", value: "date" },
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
  type TimeUnit = "date" | "week" | "month";
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
    <Box
      p={5}
      borderRadius="xl"
      bg="white"
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
      mt={4}
    >
      <Flex mb={5}>
        <Flex
          gap={4}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          <VStack w="40%" align="start">
            <Text fontSize="sm" fontWeight="bold">
              기간
            </Text>
            <Box flex="1" w="100%">
              <RadioCard.Root
                onValueChange={(e) => handleTimeRangeChange(e.value || "6M")}
                orientation="horizontal"
                align="center"
                justify="center"
                variant="surface"
                defaultValue="6M"
                size="sm"
                width="100%"
                colorPalette="blue"
              >
                <HStack align="stretch" width="100%" gap={0}>
                  {timeRangeItems.map((item, index) => (
                    <RadioCard.Item
                      key={item.value}
                      value={item.value}
                      px={3}
                      flex="1"
                      borderLeftRadius={index === 0 ? "md" : 0}
                      borderRightRadius={
                        index === timeRangeItems.length - 1 ? "md" : 0
                      }
                      borderRight={
                        index !== timeRangeItems.length - 1
                          ? "1px solid"
                          : "none"
                      }
                      borderRightColor="blue.100"
                      transition="all 0.2s"
                      _hover={{
                        bg: "blue.50",
                      }}
                    >
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl>
                        <RadioCard.ItemText
                          fontSize="sm"
                          fontWeight="500"
                          textAlign="center"
                        >
                          {item.label}
                        </RadioCard.ItemText>
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                  ))}
                </HStack>
              </RadioCard.Root>
            </Box>
          </VStack>

          <VStack w="40%" align="start">
            <Text fontSize="sm" fontWeight="bold">
              단위
            </Text>
            <Box flex="1" w={"100%"}>
              <RadioCard.Root
                onValueChange={(e) => handleTimeUnitChange(e.value || "month")}
                orientation="horizontal"
                align="center"
                justify="center"
                variant="surface"
                defaultValue="month"
                size="sm"
                width="100%"
                colorPalette={"blue"}
              >
                <HStack align="stretch" width="100%" gap={0}>
                  {timeUnitItems.map((item, index) => (
                    <RadioCard.Item
                      key={item.value}
                      value={item.value}
                      px={3}
                      flex="1"
                      borderLeftRadius={index === 0 ? "md" : 0}
                      borderRightRadius={
                        index === timeRangeItems.length - 1 ? "md" : 0
                      }
                      borderRight={
                        index !== timeRangeItems.length - 1
                          ? "1px solid"
                          : "none"
                      }
                      borderRightColor="blue.100"
                      transition="all 0.2s"
                      _hover={{
                        bg: "blue.50",
                      }}
                    >
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl>
                        <RadioCard.ItemText
                          fontSize="sm"
                          fontWeight="500"
                          textAlign="center"
                        >
                          {item.label}
                        </RadioCard.ItemText>
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                  ))}
                </HStack>
              </RadioCard.Root>
            </Box>
          </VStack>
        </Flex>
      </Flex>
      <Box
        borderRadius="lg"
        overflow="hidden"
        height="300px"
        border="1px"
        borderColor="gray.200"
        bg="white"
      >
        {loading ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Spinner size="lg" color="blue.500" borderWidth="3px" />
          </Flex>
        ) : error ? (
          <Flex
            justifyContent="center"
            alignItems="center"
            height="100%"
            flexDirection="column"
          >
            <Text color="red.500" mb={2}>
              Error: {error}
            </Text>
            <IconButton
              onClick={() => {
                setTimeRange("6M");
                setTimeUnit("month");
              }}
              size="sm"
              colorScheme="indigo"
              variant={"ghost"}
              loadingText="동기화 중..."
            >
              <FaSyncAlt />
            </IconButton>
          </Flex>
        ) : trendData.length === 0 ? (
          <Flex
            justifyContent="center"
            alignItems="center"
            height="100%"
            flexDirection="column"
          >
            <Text color="gray.500" mb={2}>
              데이터가 없습니다
            </Text>
            <Text fontSize="sm" color="gray.400">
              다른 기간이나 단위를 선택해보세요
            </Text>
          </Flex>
        ) : (
          <Box width="100%" height="100%" p={2}>
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
