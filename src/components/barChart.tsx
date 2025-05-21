import React, { useEffect, useRef, useState } from "react";
import { getEsgRatingByOrganization } from "@/lib/api/get";
import { Box, Center, Spinner } from "@chakra-ui/react";
import * as d3 from "d3";

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

export const EsgBarData = ({
  organizationId,
  targetKey,
}: {
  organizationId: string;
  targetKey: "E" | "S" | "G";
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getEsgRatingByOrganization(organizationId);
        const ratings = res?.ratings || [];

        // 가장 최신 연도 데이터만 사용
        const latest = ratings[ratings.length - 1];

        const keyMap: Record<"E" | "S" | "G", keyof typeof latest> = {
          E: "environment",
          S: "social",
          G: "governance",
        };

        const data = [
          {
            key: targetKey,
            value: convertGradeToNumber(String(latest[keyMap[targetKey]])),
          },
        ];

        createBarChart(data);
      } catch (error) {
        console.error("ESG 차트 데이터 가져오기 실패:", error);
        setError("데이터를 가져오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
        console.log("ESG 차트 데이터 로딩 완료");
      }
    };

    fetchData();
  }, [organizationId]);

  const createBarChart = (data: { key: string; value: number }[]) => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 5, right: 15, bottom: 5, left: 20 };
    const container = svgRef.current?.parentElement;
    const fullWidth = container?.clientWidth ?? 350;
    const fullHeight = container?.clientHeight ?? 80;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", fullWidth)
      .attr("height", fullHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create gradient definitions
    const gradients = {
      E: {
        id: "gradientE",
        startColor: "rgba(72, 187, 120, 0.6)",
        endColor: "rgba(72, 187, 120, 1)",
      },
      S: {
        id: "gradientS",
        startColor: "rgba(159, 122, 234, 0.6)",
        endColor: "rgba(159, 122, 234, 1)",
      },
      G: {
        id: "gradientG",
        startColor: "rgba(236, 153, 75, 0.6)",
        endColor: "rgba(236, 153, 75, 1)",
      },
    };

    // Add gradient definitions to SVG
    const defs = svg.append("defs");

    Object.values(gradients).forEach((gradient) => {
      const linearGradient = defs
        .append("linearGradient")
        .attr("id", gradient.id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      linearGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", gradient.startColor);

      linearGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", gradient.endColor);
    });

    // Update colors reference
    const colors: Record<string, string> = {
      E: `url(#${gradients.E.id})`,
      S: `url(#${gradients.S.id})`,
      G: `url(#${gradients.G.id})`,
    };

    // 스케일 조정
    const x = d3.scaleLinear().domain([0, 6]).range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.key))
      .range([0, height])
      .padding(0.5);

    svg
      .append("g")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(y))
      .style("font-size", "12px")
      .call((g) => g.select(".domain").remove());

    // Add background track for bars
    svg
      .selectAll(".bar-background")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-background")
      .attr("y", (d) => y(d.key)!)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", x(5)) // Always full width (5 = A+)
      .attr("fill", "#f0f0f0")
      .attr("rx", 4) // Rounded corners
      .attr("ry", 4);

    // Animated bars with rounded corners
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.key)!)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", 0) // Start at width 0 for animation
      .attr("fill", (d) => colors[d.key])
      .attr("rx", 4) // Rounded corners
      .attr("ry", 4)
      .transition() // Add transition
      .duration(800) // Animation duration
      .ease(d3.easeElastic.period(0.4)) // Bouncy animation
      .attr("width", (d) => x(d.value));

    // 숫자를 등급으로 변환하는 함수 추가
    const convertNumberToGrade = (value: number): string => {
      const grades = {
        5: "A+",
        4: "A",
        3: "B+",
        2: "B",
        1: "C",
        0: "D",
      };
      return grades[value as keyof typeof grades] || "-";
    };

    // 텍스트 레이블 추가
    // svg
    //   .selectAll(".label")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .attr("y", (d) => y(d.key)! + y.bandwidth() / 2 + 2)
    //   .attr("x", (d) => x(d.value) + 3) // 레이블 위치
    //   .text((d) => convertNumberToGrade(d.value))
    //   .style("font-size", "15px")
    //   .attr("full", (d) => colors[d.key]);

    // Add a circular badge with score
    svg
      .selectAll(".score-badge")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "score-badge")
      .attr("cy", (d) => y(d.key)! + y.bandwidth() / 2)
      .attr("cx", (d) => x(d.value) + 20)
      .attr("r", 14)
      .attr("fill", "white")
      .attr("stroke", (d) => {
        // Extract color from gradient URL
        const key = d.key as keyof typeof gradients;
        return gradients[key].endColor;
      })
      .attr("stroke-width", 2);

    // Text labels inside badge
    svg
      .selectAll(".score-text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "score-text")
      .attr("y", (d) => y(d.key)! + y.bandwidth() / 2 + 5)
      .attr("x", (d) => x(d.value) + 20)
      .text((d) => convertNumberToGrade(d.value))
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .attr("fill", (d) => {
        const key = d.key as keyof typeof gradients;
        return gradients[key].endColor;
      });

    // Add performance indicator label
    const performanceLabels = {
      5: "우수",
      4: "양호",
      3: "보통",
      2: "미흡",
      1: "취약",
      0: "매우 취약",
    };

    svg
      .selectAll(".performance-text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "performance-text")
      .attr("y", (d) => y(d.key)! + y.bandwidth() / 2 + 5)
      .attr("x", (d) => x(d.value) + 45)
      .text(
        (d) =>
          performanceLabels[d.value as keyof typeof performanceLabels] || ""
      )
      .attr("text-anchor", "start")
      .attr("font-size", "12px")
      .attr("fill", "gray")
      .style("opacity", 0)
      .transition()
      .delay(800)
      .duration(400)
      .style("opacity", 1);
  };

  return (
    <Box
      width="full"
      height="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow={"auto"}
    >
      <svg width={"full"} height={"80px"} ref={svgRef}></svg>
    </Box>
  );
};
