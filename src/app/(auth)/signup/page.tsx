'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'

import {toaster} from '@/components/ui/toaster'
import {ApiError} from '@/lib/util/handleApiError'
import {Box, Button, Flex, Input, Stack, Text, Card, Heading} from '@chakra-ui/react'
import {signup} from '@/lib/api/auth'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function isValidEmail(email: string) {
  return emailRegex.test(email)
}

const SignUpPage = () => {
  const [username, setUsername] = useState('')

  const [id, setId] = useState('')
  const [email, setEmail] = useState('') // 이메일 추가
  const [phonenumber, setPhonenumber] = useState('') // 이메일 추가
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('') // 아이디 중복 오류 메시지
  const [emailError, setEmailError] = useState('') // 이메일 중복 오류 메시지
  const router = useRouter()

  const handleSubmit = async () => {
    console.log('handleSubmit called')
    console.log('username:', username)

    if (!username || !email || !id || !password || !confirmPassword || !phonenumber) {
      setError('모든 필드를 채워주세요.')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (isValidEmail(email) === false) {
      setError('유효한 이메일 주소를 입력하세요.')
      return
    }

    try {
      await signup({
        username: id,
        password: password, // 비밀번호 추가
        name: username,
        email: email, // 이메일 추가
        phone: phonenumber // 전화번호 추가
      })
      toaster.success({
        title: '회원 가입 성공!'
      })
      router.push('/login')
    } catch (error) {
      toaster.error({
        title:
          error instanceof ApiError ? error.message : '알 수 없는 오류가 발생했습니다.'
      })
    }
  }

  return (
    <Flex
      minH="100vh" // 화면 전체 높이
      justify="center" // 수평 중앙
      align="center" // 수직 중앙
      bg="white" // 필요시 배경
    >
      <Card.Root
        boxAlign={'center'}
        display="flex"
        justifyContent="center"
        minH="50vh"
        maxW="lg"
        mx="auto"
        paddingLeft={4}
        paddingRight={4}
        bg="transparent"
        borderRadius="lg"
        boxShadow="lg"
        borderWidth="1px"
        borderColor="white">
        <Box width={{base: '100%', md: '400px'}} bg="transparent" p={8} borderRadius="md">
          <Heading as="h2" size="3xl" color="black" textAlign="center" mb={6}>
            Sign Up
          </Heading>
          <Stack gap={4}>
            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                Username
              </Text>

              <Input
                variant="flushed"
                placeholder=""
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                color="black"
                _placeholder={{color: 'gray.300'}}
                borderColor="black"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                ID
              </Text>
              <Input
                variant="flushed"
                placeholder=""
                value={id}
                onChange={e => setId(e.target.value)}
                color="black"
                _placeholder={{color: 'gray.300'}}
                borderColor="black"
              />
            </Box>

            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                Password
              </Text>

              <Input
                variant="flushed"
                placeholder=""
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                color="black"
                _placeholder={{color: 'gray.300'}}
                borderColor="black"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                Confirm-Password
              </Text>

              <Input
                variant="flushed"
                placeholder=""
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                color="black"
                _placeholder={{color: 'gray.300'}}
                borderColor="black"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                Email
              </Text>
              <Input
                variant="flushed"
                placeholder=""
                value={email}
                onChange={e => setEmail(e.target.value)}
                color="black"
                _placeholder={{color: 'gray.300'}}
                borderColor="black"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="medium">
                Phone number
              </Text>

              <Input
                variant="flushed"
                placeholder=""
                type="text"
                value={phonenumber}
                onChange={e => setPhonenumber(e.target.value)}
                color="black"
                _placeholder={{color: 'gray.300'}}
                borderColor="black"
              />
            </Box>

            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              bg="black"
              color="white"
              _hover={{bg: 'gray.500'}}
              size="lg"
              fontWeight="bold"
              onClick={handleSubmit}>
              Create Account
            </Button>
            <Flex justify="center"></Flex>
          </Stack>
        </Box>
      </Card.Root>
    </Flex>
  )
}

export default SignUpPage
