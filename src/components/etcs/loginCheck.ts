import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {checkLogin} from '@/lib/api/auth'

const useLoginCheck = () => {
  const router = useRouter()
  useEffect(() => {
    const check = async () => {
      const loggedIn = await checkLogin()
      if (!loggedIn) {
        router.push('/login')
      }
    }
    check()
  }, [router])
}

export default useLoginCheck
