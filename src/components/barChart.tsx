import React, {useEffect, useRef} from 'react'
import {getEsgRatingByOrganization} from '@/lib/api/get'
import {Box} from '@chakra-ui/react'
import * as d3 from 'd3'

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

export const EsgBarData = ({
  organizationId,
  targetKey
}: {
  organizationId: string
  targetKey: 'E' | 'S' | 'G'
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEsgRatingByOrganization(organizationId)
        const ratings = res?.ratings || []

        // 가장 최신 연도 데이터만 사용
        const latest = ratings[ratings.length - 1]

        const keyMap: Record<'E' | 'S' | 'G', keyof typeof latest> = {
          E: 'environment',
          S: 'social',
          G: 'governance'
        }

        const data = [
          {
            key: targetKey,
            value: convertGradeToNumber(String(latest[keyMap[targetKey]]))
          }
          //   {key: 'E', value: convertGradeToNumber(latest.environment)},
          //   {key: 'S', value: convertGradeToNumber(latest.social)},
          //   {key: 'G', value: convertGradeToNumber(latest.governance)}
        ]

        createBarChart(data)
      } catch (error) {
        console.error('ESG 차트 데이터 가져오기 실패:', error)
      }
    }

    fetchData()
  }, [organizationId])

  const createBarChart = (data: {key: string; value: number}[]) => {
    if (!svgRef.current) return

    d3.select(svgRef.current).selectAll('*').remove()

    const margin = {top: 5, right: 15, bottom: 5, left: 20}
    const container = svgRef.current?.parentElement
    const fullWidth = container?.clientWidth ?? 350
    const fullHeight = container?.clientHeight ?? 80
    const width = fullWidth - margin.left - margin.right
    const height = fullHeight - margin.top - margin.bottom

    const svg = d3
      .select(svgRef.current)
      .attr('width', fullWidth)
      .attr('height', fullHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // 스케일 조정
    const x = d3.scaleLinear().domain([0, 6]).range([0, width])

    const y = d3
      .scaleBand()
      .domain(data.map(d => d.key))
      .range([0, height])
      .padding(0.5)

    const colors: Record<string, string> = {
      E: 'rgba(72, 187, 120, 1)',
      S: 'rgba(255, 204, 77, 1)',
      G: 'rgba(56, 89, 138, 1)'
    }

    svg
      .append('g')
      .attr('transform', `translate(0, 0)`)
      .call(d3.axisLeft(y))
      .style('font-size', '12px')
      .call(g => g.select('.domain').remove())

    // //x축 등급
    // svg
    //   .append('g')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(
    //     d3
    //       .axisBottom(x)
    //       .ticks(5)
    //       .tickFormat(d => {
    //         const grades = ['D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+']
    //         return grades[d as number] ?? ''
    //       })
    //   )
    //   .style('font-size', '10px')

    // 막대 추가
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')

      .attr('y', d => y(d.key)!)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.value))
      .attr('fill', d => colors[d.key])

    // 숫자를 등급으로 변환하는 함수 추가
    const convertNumberToGrade = (value: number): string => {
      const grades = {
        5: 'A+',
        4: 'A',
        3: 'B+',
        2: 'B',
        1: 'C',
        0: 'D'
      }
      return grades[value as keyof typeof grades] || '-'
    }

    // 텍스트 레이블 추가
    svg
      .selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('y', d => y(d.key)! + y.bandwidth() / 2 + 2)
      .attr('x', d => x(d.value) + 3) // 레이블 위치
      // .text(d => d.value)
      .text(d => convertNumberToGrade(d.value))
      .style('font-size', '15px')
      .attr('full', d => colors[d.key])
  }

  return (
    <Box
      width="full"
      height="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow={'auto'}>
      <svg width={'full'} height={'80px'} ref={svgRef}></svg>
    </Box>
  )
}
