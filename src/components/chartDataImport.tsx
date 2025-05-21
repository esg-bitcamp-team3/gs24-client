import React, { useEffect, useRef, useState } from "react";
import { getEsgRatingByOrganization } from "@/lib/api/get";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import * as d3 from "d3";

// ESG 등급 숫자로 변환
const convertGradeToNumber = (grade: string): number => {
  const gradeMap: { [key: string]: number } = {
    "A+": 5,
    A: 4,
    "B+": 3,
    B: 2,
    C: 1,
    D: 0,
  };
  return gradeMap[grade.toUpperCase()] ?? 0;
};

// esgRatings는 특정 회사의 ESG 평가 데이터를 포함하는 EsgRatingResponse 타입의 props
export const EsgLineData = ({ organizationId }: { organizationId: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getEsgRatingByOrganization(organizationId);
        const ratings = res?.ratings || [];

        if (ratings.length === 0) {
          setError("데이터가 없습니다");
          return;
        }

        // Convert data for D3
        const data = ratings.map((r) => ({
          year: r.year,
          E: convertGradeToNumber(r.environment),
          S: convertGradeToNumber(r.social),
          G: convertGradeToNumber(r.governance),
        }));

        createLineChart(data);
      } catch (error) {
        console.error("ESG 차트 데이터 가져오기 실패:", error);
        setError("데이터를 불러올 수 없습니다");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [organizationId]);

  const createLineChart = (data: any[]) => {
    if (!svgRef.current) return;

    // Clear previous chart
    data.sort((a, b) => a.year - b.year);
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 20, right: 120, bottom: 40, left: 40 };
    const container = svgRef.current?.parentElement;
    const fullWidth = container?.clientWidth ?? 500;
    const fullHeight = container?.clientHeight ?? 300;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", fullWidth)
      .attr("height", fullHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define gradients
    const defs = svg.append("defs");

    // Add gradient definitions
    const gradientIds = {
      E: "E-line-gradient",
      S: "S-line-gradient",
      G: "G-line-gradient",
    };

    // E Gradient (Green)
    const eGradient = defs
      .append("linearGradient")
      .attr("id", gradientIds.E)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    eGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(72, 187, 120, 0.7)");

    eGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(72, 187, 120, 0.1)");

    // S Gradient (Purple)
    const sGradient = defs
      .append("linearGradient")
      .attr("id", gradientIds.S)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    sGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(159, 122, 234, 0.7)");

    sGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(159, 122, 234, 0.1)");

    // G Gradient (Orange)
    const gGradient = defs
      .append("linearGradient")
      .attr("id", gradientIds.G)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(236, 153, 75, 0.7)");

    gGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(236, 153, 75, 0.1)");

    // x : year
    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.year.toString()))
      .range([0, width]);

    // y : esg 등급
    const y = d3.scaleLinear().domain([0, 5.5]).range([height, 0]);

    // Create lines
    const line = d3
      .line<any>() // 라인 생성 초기화
      .x((d) => x(d.year.toString())!) // x 좌표 설정
      .y((d) => y(d.value)); //  y 좌표 설정

    // Create area generator for filled areas below lines
    const area = d3
      .area<any>()
      .x((d) => x(d.year.toString())!)
      .y0(height) // Bottom of the chart
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const keys = ["E", "S", "G"] as const;
    const colors: Record<"E" | "S" | "G", string> = {
      E: "rgba(72, 187, 120, 1)", // Green
      S: "rgba(159, 122, 234, 1)", // Purple
      G: "rgba(236, 153, 75, 1)", // Orange
    };

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(y)
          .tickValues([0, 1, 2, 3, 4, 5])
          .tickSize(-width)
          .tickFormat(() => "")
      );

    // 축 생성
    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d) => `${d}년`))
      .selectAll("text")
      .style("font-size", "11px")
      .style("font-weight", "600");

    // Add Y axis with grade labels
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickValues([0, 1, 2, 3, 4, 5]) // D, C, B, B+, A, A+
          .tickFormat((d) => {
            const customGrades: Record<number, string> = {
              0: "D",
              1: "C",
              2: "B",
              3: "B+",
              4: "A",
              5: "A+",
            };
            return customGrades[d as number] ?? "";
          })
      )
      .selectAll("text")
      .style("font-size", "11px")
      .style("font-weight", "600");

    // Draw in reverse order so area doesn't overlap important elements
    keys.forEach((key) => {
      const lineData = data.map((d) => ({
        year: d.year,
        value: d[key],
      }));

      // Add area beneath line
      // svg
      //   .append("path")
      //   .datum(lineData)
      //   .attr("fill", `url(#${gradientIds[key]}`)
      //   .attr("d", area)
      //   .attr("opacity", 0.5);

      // Add lines with animation
      const path = svg
        .append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", colors[key as keyof typeof colors])
        .attr("stroke-width", 3)
        .attr("d", line);

      // Animate line drawing
      const pathLength = path.node()?.getTotalLength() || 0;
      path
        .attr("stroke-dasharray", pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(1500)
        .attr("stroke-dashoffset", 0);

      // Add dots with animation
      svg
        .selectAll(`dot-${key}`)
        .data(lineData)
        .join("circle")
        .attr("cx", (d) => x(d.year.toString())!)
        .attr("cy", (d) => y(d.value))
        .attr("r", 0) // Start with radius 0
        .attr("fill", "white")
        .attr("stroke", colors[key as keyof typeof colors])
        .attr("stroke-width", 2)
        .transition()
        .delay((_, i) => 1500 + i * 150) // Stagger the animations
        .duration(500)
        .attr("r", 6); // End with radius 6

      // Add value labels above dots
      svg
        .selectAll(`label-${key}`)
        .data(lineData)
        .join("text")
        .attr("x", (d) => x(d.year.toString())!)
        .attr("y", (d) => y(d.value) - 15) // Position above dots
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .attr("fill", colors[key as keyof typeof colors])
        .style("opacity", 0) // Start invisible
        .text((d) => {
          const customGrades: Record<number, string> = {
            0: "D",
            1: "C",
            2: "B",
            3: "B+",
            4: "A",
            5: "A+",
          };
          return customGrades[d.value] || "";
        })
        .transition()
        .delay((_, i) => 2000 + i * 150) // Appear after dots
        .duration(300)
        .style("opacity", 1); // Fade in
    });

    // Add improved legend
    const legendData = [
      { key: "E", label: "E (환경)", color: colors.E },
      { key: "S", label: "S (사회)", color: colors.S },
      { key: "G", label: "G (지배구조)", color: colors.G },
    ];

    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(legendData)
      .join("g")
      .attr("transform", (_, i) => `translate(${width + 20},${i * 25 + 10})`)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        // Toggle visibility of the corresponding line/dots when clicked
        const opacity = svg.selectAll(`.${d.key}-elements`).style("opacity");
        svg
          .selectAll(`.${d.key}-elements`)
          .style("opacity", opacity === "1" ? "0.2" : "1");
      });

    // Add legend items with highlight effect
    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", (d) => d.color);

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 12)
      .attr("font-weight", 600)
      .text((d) => d.label);

    // Add chart title
    // svg
    //   .append("text")
    //   .attr("x", width / 2)
    //   .attr("y", -5)
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "14px")
    //   .attr("font-weight", "bold")
    //   .text("연도별 ESG 등급 변화")
    //   .style("opacity", 0)
    //   .transition()
    //   .duration(1000)
    //   .style("opacity", 1);

    // Add tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "esg-tooltip")
      .style("position", "absolute")
      .style("z-index", 10)
      .style("visibility", "hidden")
      .style("padding", "8px 12px")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("border-radius", "4px")
      .style("color", "white")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("transition", "opacity 0.2s");

    // Add interactive overlay
  };

  return (
    <Box
      mt={4}
      width={"full"}
      height={"300px"} // Fixed height for better proportions
      justifyItems={"center"}
      position="relative"
      overflow={"hidden"} // Prevent scrolling
    >
      <svg width={"full"} height={"100%"} ref={svgRef}></svg>
    </Box>
  );
};
