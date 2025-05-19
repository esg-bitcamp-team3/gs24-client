import VocabularyPage from '@/components/ui/vocabulary/page'
import {getEsgTerms} from '@/lib/api/get'

export default async function Page() {
  const terms = await getEsgTerms()
  return (
    <main>
      <VocabularyPage initialTerms={terms || []} />
    </main>
  )
}
