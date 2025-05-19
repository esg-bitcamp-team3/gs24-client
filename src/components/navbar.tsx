// src/components/Navbar.tsx
'use client'

import {Avatar, Box, Button, Flex, IconButton, Image} from '@chakra-ui/react'
import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from 'react'
import {LuLogOut, LuSearch} from 'react-icons/lu'
import {logout} from '@/lib/api/auth'
import SearchOrg from './navbar/SearchOrg'
import {Company} from '@/lib/api/interfaces/organizations'
import {getOrganizations} from '@/lib/api/get'

// 백엔드에서 받아온 회사 리스트의 타입을 정의

const Navbar: React.FC = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [companyList, setCompanyList] = useState<Company[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleCompanyClick = (companyId: string) => {
    setIsOpen(false)
    router.push(`/dashboard/${companyId}/companyInfo`)
  }

  const filteredCompanies =
    searchTerm === ''
      ? companyList
      : companyList.filter(company =>
          company.companyName
            .trim()
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        )

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getOrganizations()
        setCompanyList(data)
      } catch (error) {
        console.error('Error fetching company list:', error)
      }
    }
    loadCompanies()
  }, [])

  const logoutbtn = () => {
    logout()
    router.push('/')
  }

  return (
    <Flex
      direction="row"
      align="center"
      py="2"
      justify="space-between"
      backgroundColor="white"
      boxShadow="sm"
      shadowColor={'blackAlpha.200'}
      width="100%"
      position="fixed" // 💡 화면 상단에 고정
      top="0" // 💡 위에서 0 위치
      zIndex="1000" // 💡 다른 요소보다 위에 출력
      height="65px" // 💡 높이도 명시적으로 주면 안정감 있어
    >
      <Box display="flex" paddingX="4" alignItems="center" width="10%">
        <Image
          src="/logo.png"
          onClick={() => router.push('/dashboard')}
          cursor="pointer"
        />
      </Box>

      <Box display="flex" alignItems="center" gap="4">
        {/* 비교하기 버튼================================================================== */}
        <Button
          paddingLeft={3}
          paddingRight={3}
          variant="outline"
          color="black"
          aria-label="compare"
          onClick={() => router.push('/dashboard/companyCompare')}>
          비교하기
        </Button>
        {/* 검색하기 버튼================================================================== */}
        <SearchOrg
          label={
            <>
              <LuSearch />
              Search
            </>
          }
        />
        {/* 아바타================================================================== */}
        <div onClick={() => router.push('/myPage')} style={{cursor: 'pointer'}}>
          <Avatar.Root shape="full" size="lg">
            <Avatar.Fallback name="Segun Adebayo" />
            <Avatar.Image src="https://cdn.myanimelist.net/r/84x124/images/characters/9/131317.webp?s=d4b03c7291407bde303bc0758047f6bd" />
          </Avatar.Root>
        </div>
        {/* 나가기 버튼================================================================== */}
        <IconButton
          marginEnd={3}
          variant="ghost"
          color="black"
          aria-label="Logout"
          onClick={() => logoutbtn()}>
          <LuLogOut />
        </IconButton>
      </Box>
    </Flex>
  )
}

export default Navbar
