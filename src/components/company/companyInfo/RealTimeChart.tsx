"use client";

import { financeApi } from "@/lib/api/apiclient";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Spinner, Text, Flex, IconButton } from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";

interface PricePoint {
  time: Date;
  price: number;
}
interface chartProps {
  corpStockCode: string;
}

export default function RealTimeChart({ corpStockCode }: chartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get date range
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formatted = `${yyyy}${mm}${dd}`;

  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  if (oneMonthAgo.getDate() !== today.getDate()) {
    oneMonthAgo.setDate(0);
  }

  const yyyyAgo = oneMonthAgo.getFullYear();
  const mmAgo = String(oneMonthAgo.getMonth() + 1).padStart(2, "0");
  const ddAgo = String(oneMonthAgo.getDate()).padStart(2, "0");
  const formattedOneMonthAgo = `${yyyyAgo}${mmAgo}${ddAgo}`;

  const fetchPrice = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await financeApi.get(
        `/stock-history?code=${corpStockCode}&start_date=${formattedOneMonthAgo}&end_date=${formatted}&period_code=D&org_adj_prc=1`
      );
      const json = await res.data;

      const chartData: PricePoint[] = (json.output2 || [])
        .map((entry: any) => ({
          time: new Date(
            `${entry.stck_bsop_date.slice(0, 4)}-${entry.stck_bsop_date.slice(
              4,
              6
            )}-${entry.stck_bsop_date.slice(6, 8)}`
          ),
          price: parseInt(entry.stck_clpr, 10),
        }))
        .sort(
          (a: PricePoint, b: PricePoint) => a.time.getTime() - b.time.getTime()
        );

      if (chartData.length === 0) {
        setError("데이터가 없습니다");
      } else {
        setData(chartData);
      }
    } catch (err) {
      console.error("📉 차트 데이터 로딩 실패:", err);
      setError("데이터를 불러올 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, [corpStockCode]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Colors and styles
    const primaryColor = "#4F46E5";
    const gradientStartColor = "rgba(79, 70, 229, 0.3)"; // Reduced opacity for subtler gradient
    const gradientEndColor = "rgba(79, 70, 229, 0.0)";
    const gridColor = "#e9ecef"; // Lighter grid color
    const tooltipBgColor = "rgba(255, 255, 255, 0.95)";

    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 320;
    const margin = { top: 30, right: 70, bottom: 100, left: 70 };

    svg.selectAll("*").remove();

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.time) as [Date, Date])
      .range([margin.left, width - margin.right]);

    // Calculate price changes for coloring
    const priceChange = data[data.length - 1].price - data[0].price;
    const trendColor = priceChange >= 0 ? "#38A169" : "#E53E3E";

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.price)! * 0.98,
        d3.max(data, (d) => d.price)! * 1.02,
      ])
      .range([height - margin.bottom, margin.top]);

    // Add gradient for area
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", gradientStartColor);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", gradientEndColor);

    // Add simplified grid lines - fewer horizontal lines
    // svg
    //   .append("g")
    //   .attr("class", "grid")
    //   .attr("stroke", gridColor)
    //   .attr("stroke-opacity", 0.3)
    //   .attr("shape-rendering", "crispEdges")
    //   .call(
    //     d3
    //       .axisLeft(y)
    //       .tickValues(d3.ticks(y.domain()[0], y.domain()[1], 4)) // Reduce number of grid lines to just 4
    //       .tickSize(-width + margin.left + margin.right)
    //       .tickFormat(() => "")
    //   );

    // Area under the line
    const area = d3
      .area<PricePoint>()
      .x((d) => x(d.time))
      .y0(height - margin.bottom)
      .y1((d) => y(d.price))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    const line = d3
      .line<PricePoint>()
      .x((d) => x(d.time))
      .y((d) => y(d.price))
      .curve(d3.curveMonotoneX);

    // Add X axis with styled ticks
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5) // Reduce number of ticks
          .tickFormat((domainValue) =>
            domainValue instanceof Date
              ? d3.timeFormat("%m/%d")(domainValue)
              : ""
          )
      )
      .call((g) => g.select(".domain").attr("stroke", "#cbd5e0"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#cbd5e0"))
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "#718096")
      .style("text-anchor", "middle"); // Remove rotation for cleaner look

    // Add Y axis with styled ticks and Korean Won format
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(4) // Reduce number of ticks to match grid lines
          .tickFormat((d) => `${d3.format("~s")(+d)}`) // Simplified format, no currency symbol
      )
      .call((g) => g.select(".domain").attr("stroke", "#cbd5e0"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#cbd5e0"))
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "#718096");

    // Add currency indicator once at the top of Y-axis instead of on every tick
    svg
      .append("text")
      .attr("x", margin.left - 5)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "end")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#718096")
      .text("₩");

    // Add animated line path
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", trendColor)
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Animation: draw line from left to right
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1200)
      .ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    // Add dots at data points
    svg
      .selectAll(".data-point")
      .data(data.filter((_, i, arr) => i % Math.ceil(arr.length / 8) === 0)) // Only show dots at regular intervals
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.price))
      .attr("r", 0)
      .attr("fill", "white")
      .attr("stroke", trendColor)
      .attr("stroke-width", 2)
      .transition()
      .delay(1200) // Start after line animation
      .duration(300)
      .attr("r", 3);

    // Add current price highlight
    const latestData = data[data.length - 1];

    // Latest price point highlight
    svg
      .append("circle")
      .attr("cx", x(latestData.time))
      .attr("cy", y(latestData.price))
      .attr("r", 6)
      .attr("fill", trendColor)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .transition()
      .delay(1500)
      .duration(500)
      .style("opacity", 1);

    // Latest price label - make it cleaner
    const priceLabel = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right + 5}, ${y(latestData.price)})`
      )
      .style("opacity", 0);

    priceLabel
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "start")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", trendColor)
      .text(`₩${latestData.price.toLocaleString()}`);

    priceLabel.transition().delay(1500).duration(500).style("opacity", 1);

    // Enhanced tooltip
    const tooltip = svg
      .append("g")
      .style("display", "none")
      .style("pointer-events", "none");

    tooltip
      .append("line")
      .attr("class", "tooltip-line")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    const tooltipPoint = tooltip
      .append("circle")
      .attr("r", 5)
      .attr("fill", primaryColor)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    const tooltipBox = tooltip.append("g");

    tooltipBox
      .append("rect")
      .attr("width", 120)
      .attr("height", 50)
      .attr("rx", 6)
      .attr("fill", tooltipBgColor)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1)
      .attr("filter", "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))");

    const tooltipDate = tooltipBox
      .append("text")
      .attr("x", 10)
      .attr("y", 18)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#4A5568");

    const tooltipPrice = tooltipBox
      .append("text")
      .attr("x", 10)
      .attr("y", 38)
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .attr("fill", "#2D3748");

    // Interaction area
    svg
      .append("rect")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseover", () => tooltip.style("display", null))
      .on("mouseout", () => tooltip.style("display", "none"))
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event);
        const hoveredDate = x.invert(mx);

        const bisect = d3.bisector((d: PricePoint) => d.time).left;
        const i = bisect(data, hoveredDate, 1);
        const d0 = data[i - 1];
        const d1 = data[i];

        if (!d0 || !d1) return;

        // Find closest point
        const d =
          hoveredDate.getTime() - d0.time.getTime() >
          d1.time.getTime() - hoveredDate.getTime()
            ? d1
            : d0;

        const tx = x(d.time);
        const ty = y(d.price);

        // Position the tooltip line
        tooltip.select(".tooltip-line").attr("x1", tx).attr("x2", tx);

        // Position the dot
        tooltipPoint.attr("cx", tx).attr("cy", ty);

        // Format date and price for tooltip
        const formattedDate = d3.timeFormat("%Y년 %m월 %d일")(d.time);
        const formattedPrice = `₩${d.price.toLocaleString()}`;

        // Update tooltip text
        tooltipDate.text(formattedDate);
        tooltipPrice.text(formattedPrice);

        // Position the tooltip box
        const tooltipX = tx + 10;
        const tooltipY = ty - 60;

        // Ensure tooltip stays within bounds
        const adjustedX =
          tooltipX + 120 > width - margin.right ? tx - 130 : tooltipX;

        tooltipBox.attr("transform", `translate(${adjustedX}, ${tooltipY})`);
      });

    // Add a title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#4A5568")
      .text("최근 1개월 주가 동향");
  }, [data]);

  // Color values using Chakra UI's color mode

  return (
    <Box
      p={6}
      bg="white"
      borderRadius="xl"
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
    >
      <Flex justifyContent="end" alignItems="center" mb={4}>
        <IconButton
          onClick={fetchPrice}
          size="sm"
          color="gray.500"
          loading={isLoading}
          variant={"ghost"}
          loadingText="동기화 중..."
          padding={2}
        >
          <FaSyncAlt /> {" 동기화"}
        </IconButton>
      </Flex>

      <Box position="relative" h="320px">
        {isLoading ? (
          <Flex h="100%" justifyContent="center" alignItems="center">
            <Spinner size="lg" color="blue.500" borderWidth="3px" />
          </Flex>
        ) : error ? (
          <Flex
            h="100%"
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Text color="gray.500">{error}</Text>
            <IconButton
              onClick={fetchPrice}
              size="sm"
              colorScheme="indigo"
              loading={isLoading}
              variant={"ghost"}
              loadingText="동기화 중..."
            >
              <FaSyncAlt />
            </IconButton>
          </Flex>
        ) : (
          <svg ref={svgRef} width="100%" height="100%" overflow="visible"></svg>
        )}
      </Box>
    </Box>
  );
}
