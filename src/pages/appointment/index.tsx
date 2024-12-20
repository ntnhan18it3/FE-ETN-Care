import { useState } from 'react'
import { toast } from 'react-toastify'
import Steps, { StepsProps } from '../../components/Steps'
import { dateFormat } from '../../utils'
import DoctorSelect from './DoctorSelect'
import TimeSelect from './TimeSelect'
import VerifyAppointment from './VerifyAppointment'
import Waiting from './Waiting'

export type AppointmentInfo = {
  name?: string
  phone?: string
  service?: number
  note?: string
  date?: Date
  session?: number
  from?: Date
  to?: Date
  room?: string
}

export default function Appointment() {
  const [step, setStep] = useState(1)
  const [doctorSelected, setDoctorSelected] = useState<Doctor | undefined>()
  const [info, setInfo] = useState<AppointmentInfo | undefined>()

  const handleTimeSelect = (info?: AppointmentInfo) => {
    setInfo(info)
    setStep(3)
    toast.success('Đã hoàn thành bước 2')
  }

  const handleDoctorSelect = (doctor?: Doctor) => {
    setDoctorSelected(doctor)
    setStep(2)
    toast.success('Đã hoàn thành bước đầu tiên')
  }

  const handleStepSelect = (st: number) => {
    switch (st) {
      case 4:
        return
      case 3:
        {
          if (step == 4) return toast.info('Không thể quay lại từ bước này')
          if (!info) {
            toast.error('Vui lòng hoàn thành bước 2')
            return
          }
          setInfo(undefined)
        }
        break
      case 2:
        {
          if (step == 4) return toast.info('Không thể quay lại từ bước này')
          setInfo(undefined)
        }
        break
      case 1:
        {
          if (step == 4) return toast.info('Không thể quay lại từ bước này')
          setInfo(undefined)
        }
        break
    }
    setStep(st)
  }
  console.log('info', info)
  const data: StepsProps = {
    title: 'Các bước đặt lịch khám',
    currentStep: 1,
    steps: [
      {
        title: `Bước 1 ${doctorSelected ? ': ' + doctorSelected?.fullName : ': Bác sĩ bất kỳ'}`,
        description: 'Chọn bác sĩ muốn đặt lịch khám'
      },
      {
        title: `Bước 2 ${info?.from ? ': ' + dateFormat(info?.from || '') : ''}`,
        description: 'Chọn thời gian bạn mong muốn'
      },
      {
        title: `Bước 3 ${step === 4 ? ': Hoàn tất' : ''}`,
        description: 'Xác nhận của bạn'
      },
      {
        title: 'Bước 4',
        description: 'Hoàn tất thủ tục'
      }
    ]
  }

  const render = () => {
    switch (step) {
      case 1:
        return <DoctorSelect onSelect={handleDoctorSelect} />
      case 2:
        return <TimeSelect doctor={doctorSelected} info={info} onSelect={handleTimeSelect} />
      case 3:
        return <VerifyAppointment doctor={doctorSelected} info={info} onSubmit={() => setStep(4)} />
      case 4:
        return <Waiting />
    }
  }

  return (
    <div>
      <div className='row'>
        <div className='col-md-4'>
          <Steps data={{ ...data, currentStep: step, onChange: handleStepSelect }} />
        </div>
        <div className='col-md-8'>{render()}</div>
      </div>
    </div>
  )
}
