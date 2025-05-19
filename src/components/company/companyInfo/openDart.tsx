import {Button, CloseButton, Dialog, Portal} from '@chakra-ui/react'
import axios from 'axios'
import {useEffect, useState} from 'react'

interface OpenDartProps {
  orgCode: string
}

const OpenDart = ({orgCode}: OpenDartProps) => {
  const [rceptNo, setRceptNo] = useState('')
  orgCode = orgCode || '00126380'
  const year = new Date().getFullYear() - 1
  const getRcepNo = async () => {
    try {
      const response = await axios.get(
        `https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json?crtfc_key=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&corp_code=${orgCode}&bsns_year=${year}&reprt_code=11011&fs_div=OFS`
      )

      setRceptNo(response.data.list.rcept_no)
      // console.log(response.data.list.rcept_no)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const orgCodes: string = '20250515002103'
  // const link: string = `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`
  const link: string = `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${orgCodes}`
  useEffect(() => {
    getRcepNo()
  }, [])
  return (
    <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          재무제표 보기
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="80vw" maxH="80vh" p={0} overflow="hidden">
            <Dialog.Header p={4} display="flex" alignItems="center">
              <Dialog.Title>재무제표</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body p={0} h="calc(80vh - 48px)">
              <iframe
                src={link}
                title="Naver"
                width="100%"
                height="100%"
                style={{border: 'none'}}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default OpenDart
