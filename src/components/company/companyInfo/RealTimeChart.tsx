"use client";

import { financeApi } from "@/lib/api/apiclient";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

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

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const dd = String(today.getDate()).padStart(2, "0");
  const formatted = `${yyyy}${mm}${dd}`;

  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  // 월 말일 보정 (예: 3월 31일 - 1개월 → 2월 31일은 없는 날짜)
  if (oneMonthAgo.getDate() !== today.getDate()) {
    oneMonthAgo.setDate(0); // 이전 달의 말일로 자동 조정
  }

  const yyyyAgo = oneMonthAgo.getFullYear();
  const mmAgo = String(oneMonthAgo.getMonth() + 1).padStart(2, "0");
  const ddAgo = String(oneMonthAgo.getDate()).padStart(2, "0");
  const formattedOneMonthAgo = `${yyyyAgo}${mmAgo}${ddAgo}`;

  // ✅ 컴포넌트 내부에 선언해야 인식됨!
  const fetchPrice = async (): Promise<void> => {
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
          (
            a: { time: { getTime: () => number } },
            b: { time: { getTime: () => number } }
          ) => a.time.getTime() - b.time.getTime()
        ); // 날짜순 정렬

      setData(chartData);
    } catch (err) {
      console.error("📉 차트 데이터 로딩 실패:", err);
    }
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 320;
    const margin = { top: 30, right: 40, bottom: 100, left: 60 }; // ⬅️ 더 넓게

    svg.selectAll("*").remove();

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.time) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.price)! * 0.98,
        d3.max(data, (d) => d.price)! * 1.02,
      ])
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<PricePoint>()
      .x((d) => x(d.time))
      .y((d) => y(d.price))
      .curve(d3.curveMonotoneX);

    // X축 (📅 날짜 기준)
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(10)
          .tickFormat((domainValue) =>
            domainValue instanceof Date
              ? d3.timeFormat("%m-%d")(domainValue)
              : ""
          )
      )
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    // Y축
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // 📈 라인 그리기
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4F46E5")
      .attr("stroke-width", 2)
      .attr("d", line);

    // 🔍 Tooltip 요소 추가
    const tooltip = svg.append("g").style("display", "none");

    tooltip
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#4F46E5")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("pointer-events", "none");

    const tooltipBox = tooltip
      .append("rect")
      .attr("x", 10)
      .attr("y", -30)
      .attr("width", 120)
      .attr("height", 40)
      .attr("rx", 6)
      .attr("fill", "#ffffffdd")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))");

    const tooltipText = tooltip
      .append("text")
      .attr("x", 15)
      .attr("y", -12)
      .attr("fill", "#111")
      .attr("font-size", "12px")
      .style("pointer-events", "none");

    // 📌 인터랙션 감지 영역
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseover", () => tooltip.style("display", null))
      .on("mouseout", () => tooltip.style("display", "none"))
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event);
        const hoveredDate = x.invert(mx);

        const bisect = d3.bisector((d: PricePoint) => d.time).center;
        const i = bisect(data, hoveredDate);
        const d = data[i];

        const tx = x(d.time);
        const ty = y(d.price);

        tooltip.attr("transform", `translate(${tx},${ty})`);
        tooltipText.text(
          `${d3.timeFormat("%m-%d")(d.time)}\n₩${d.price.toLocaleString()}`
        );
      });
  }, [data]);

  return (
    <div className="p-4">
      <button
        onClick={fetchPrice}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        🔄 동기화
      </button>
      <svg ref={svgRef} width={700} height={320}></svg>
    </div>
  );
}
