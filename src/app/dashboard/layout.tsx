'use client'
import NavBar from '@/components/navbar'
import {Box, Flex} from '@chakra-ui/react'

export default function Corporation({children}: {children: React.ReactNode}) {
  return (
    <>
      <NavBar />

      <Box mt={'65px'} p={8} overflow={'auto'} maxH={'full'}>
        {children}
      </Box>
    </>
  )
}
