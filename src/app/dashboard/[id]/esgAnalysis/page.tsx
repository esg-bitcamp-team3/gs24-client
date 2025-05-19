'use client'

import EsgAnalysisCard from '@/components/company/EsgAnalysisCard'
import { use } from 'react'

interface Props {
  params: Promise<{id: string}>
}

const EsgAnalysis = ({params}: Props) => {
  const {id} = use(params)
  
  return <EsgAnalysisCard orgId={id} />
}

export default EsgAnalysis