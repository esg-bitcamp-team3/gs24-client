"use client";

import KeywordTrendCard from "@/components/company/keywordTrend/KeywordTrendCard";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const EsgAnalysis = ({ params }: Props) => {
  const { id } = use(params);

  return <KeywordTrendCard orgId={id} />;
};

export default EsgAnalysis;
