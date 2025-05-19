import React, {useEffect, useRef} from 'react'
import {getEsgRatingByOrganization} from '@/lib/api/get'

import {Box} from '@chakra-ui/react'
import * as d3 from 'd3'

// ESG 등급 숫자로 변환
const convertGradeToNumber = (grade: string): number => {
  const gradeMap: {[key: string]: number} = {
    'A+': 5,
    A: 4,
    'B+': 3,
    B: 2,
    C: 1,
    D: 0
  }
  return gradeMap[grade.toUpperCase()] ?? 0
}

// esgRatings는 특정 회사의 ESG 평가 데이터를 포함하는 EsgRatingResponse 타입의 props
export const EsgLineData = ({organizationId}: {organizationId: string}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEsgRatingByOrganization(organizationId)
        const ratings = res?.ratings || []

        // Convert data for D3
        const data = ratings.map(r => ({
          year: r.year,
          E: convertGradeToNumber(r.environment),
          S: convertGradeToNumber(r.social),
          G: convertGradeToNumber(r.governance)
        }))

        createLineChart(data)
      } catch (error) {
        console.error('ESG 차트 데이터 가져오기 실패:', error)
      }
    }

    fetchData()
  }, [organizationId])

  const createLineChart = (data: any[]) => {
    if (!svgRef.current) return

    // Clear previous chart
    data.sort((a, b) => a.year - b.year)
    d3.select(svgRef.current).selectAll('*').remove()

    // Set dimensions
    const margin = {top: 20, right: 120, bottom: 40, left: 40}
    const container = svgRef.current?.parentElement
    const fullWidth = container?.clientWidth ?? 500
    const fullHeight = container?.clientHeight ?? 300
    const width = fullWidth - margin.left - margin.right
    const height = fullHeight - margin.top - margin.bottom

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', fullWidth)
      .attr('height', fullHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // x : year
    const x = d3
      .scalePoint()
      .domain(data.map(d => d.year.toString()))
      .range([0, width])

    // y : esg 등급
    const y = d3.scaleLinear().domain([0, 6]).range([height, 0])

    // Create lines
    const line = d3
      .line<any>() // 라인 생성 초기화
      .x(d => x(d.year.toString())!) // x 좌표 설정
      .y(d => y(d.value)) //  y 좌표 설정
      .curve(d3.curveMonotoneX) // 부드러운 곡선 처리

    const keys = ['E', 'S', 'G'] as const
    const colors: Record<'E' | 'S' | 'G', string> = {
      E: 'rgba(72, 187, 120, 1)',
      S: 'rgba(66, 153, 225, 1)',
      G: 'rgba(245, 101, 101, 1)'
    }

    // 축 생성
    // Add X axis
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

    // Add Y axis with grade labels
    svg.append('g').call(
      d3
        .axisLeft(y)
        .tickValues([0, 1, 2, 3, 4, 5]) // D, C, B, B+, A, A+
        .tickFormat(d => {
          const customGrades: Record<number, string> = {
            0: '',
            1: 'D',
            2: 'C',
            3: 'B',
            4: 'B+',
            5: 'A',
            6: 'A+'
          }
          return customGrades[d as number] ?? ''
        })
    )

    keys.forEach(key => {
      const lineData = data.map(d => ({
        year: d.year,
        value: d[key]
      }))

      // Add lines
      svg
        .append('path')
        .datum(lineData) // 데이터 바인딩
        .attr('fill', 'none') // 내부 채움 없음
        .attr('stroke', colors[key as keyof typeof colors]) // 선 색 지정
        .attr('stroke-width', 2) // 선 두께
        .attr('d', line) // 선 경로 생성

      // Add dots
      svg
        .selectAll(`dot-${key}`)
        .data(lineData)
        .join('circle')
        .attr('cx', d => x(d.year.toString())!)
        .attr('cy', d => y(d.value))
        .attr('r', 4)
        .attr('fill', colors[key as keyof typeof colors])
    })

    // Add legend
    const legend = svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(['E (환경)', 'S (사회)', 'G (지배구조)'])
      .join('g')
      .attr('transform', (d, i) => `translate(${width + 20},${i * 20})`)

    legend
      .append('circle')
      .attr('r', 4)
      .attr('fill', (d, i) => colors[keys[i]])

    legend
      .append('text')
      .attr('x', 10)
      .attr('y', 3)
      .text(d => d)
  }

  return (
    <Box
      mt={4}
      width={'full'}
      height={'full'}
      justifyItems={'center'}
      overflow={'auto'}>
      <svg width={'full'} height={'full'} ref={svgRef}></svg>
    </Box>
  )
}
