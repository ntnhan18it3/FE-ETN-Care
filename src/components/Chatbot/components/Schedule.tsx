import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useAppSelector } from '../../../hooks/store'
import { phoneRegExp } from '../../../utils'
import ClipLoader from 'react-spinners/ClipLoader'

type StepOneInputs = {
  name?: string
  phone?: string
  service?: string
  note?: string
  date?: string
  time?: string
}

export const StepOneSchedule = (props: any) => {
  const [submitted, setSubmitted] = useState(false)
  const { user } = useAppSelector((state) => state.auth)

  const today = new Date()
  const formattedToday = today.toISOString().split('T')[0] // "YYYY-MM-DD"

  const schema = yup.object<StepOneInputs>({
    name: yup.string().required('Không để trống'),
    phone: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Không để trống'),
    service: yup.string().required('Không để trống'),
    note: yup.string().nullable(),
    date: yup.string().test('date', 'Thời gian đã qua, vui lòng chọn thòi gian sắp tới', (value) => {
      if (!value) return true
      return value >= formattedToday
    }),
    time: yup.string().test('date', 'Thời gian đã qua, vui lòng chọn thòi gian sắp tới', (value) => {
      const date = getValues('date')
      if (!date) return true
      if (date > formattedToday) return true
      if (date < formattedToday) return false
      if (value == '1') {
        if (today.getHours() > 11) return false
      } else {
        if (today.getHours() > 17) return false
      }
      return true
    })
  })

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm<StepOneInputs>({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (user) {
      const defaultValues: StepOneInputs = {
        name: user?.fullName,
        phone: user?.phone
      }
      reset(defaultValues)
    }
  }, [user])

  const onSubmit = async (data: StepOneInputs) => {
    setSubmitted(true)
    props.actionProvider.handleAddMessageToState('Cảm ơn vì thông tin của bạn.')
    props.actionProvider.handleAddMessageToState(
      'Chúng tôi đang tiến hành xếp lịch cho bạn, vui lòng chờ!',
      'schedule2'
    )
  }

  return (
    <div className='appointment-scheduling'>
      <form onSubmit={handleSubmit(onSubmit, (invalid) => console.log(invalid))}>
        <div className='row'>
          <div className='col-md-6'>
            {' '}
            <div className='row mb-2'>
              <label htmlFor='name' className='col-form-label'>
                Họ và tên *
              </label>
              <div>
                <input type='text' id='name' className='form-control' {...register('name')} disabled={submitted} />
                {errors.name && <span className='form-error-message'>{errors.name.message}</span>}
              </div>
            </div>
            <div className='row mb-2'>
              <label htmlFor='phone' className='col-form-label'>
                Số điện thoại *
              </label>
              <div>
                <input type='text' id='phone' className='form-control' {...register('phone')} disabled={submitted} />
                {errors.phone && <span className='form-error-message'>{errors.phone.message}</span>}
              </div>
            </div>
            <div className='row mb-2'>
              <label htmlFor='note' className='col-form-label'>
                Ghi chú
              </label>
              <div>
                <textarea
                  className='form-control'
                  id='note'
                  style={{ height: 100 }}
                  placeholder=''
                  {...register('note')}
                  disabled={submitted}
                />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='row mb-2'>
              <label htmlFor='service' className='col-form-label'>
                Dịch vụ khám
              </label>
              <div>
                <select
                  id='service'
                  className='form-select'
                  aria-label='Default select example'
                  {...register('service')}
                  disabled={submitted}>
                  <option value='0'></option>
                  <option value='1'>Tai</option>
                  <option value='2'>Mũi</option>
                  <option value='3'>Họng</option>
                  <option value='4'>Khác</option>
                </select>
                {errors.service && <span className='form-error-message'>{errors.service.message}</span>}
              </div>
            </div>
            <div className='mb-2'>
              <label htmlFor='day' className='col-form-label'>
                Ngày
              </label>
              <div>
                <input type='date' id='day' className='form-control' {...register('date')} disabled={submitted} />
                {errors.date && <span className='form-error-message'>{errors.date.message}</span>}
              </div>
            </div>
            <div className='mb-2'>
              <label htmlFor='session' className='col-form-label'>
                Thời gian
              </label>
              <div>
                <select
                  id='session'
                  className='form-select'
                  aria-label='Default select example'
                  {...register('time')}
                  disabled={submitted}>
                  <option value={0}></option>
                  <option value={1}>Buổi sáng</option>
                  <option value={2}>Buổi chiều</option>
                </select>
                {errors.time && <span className='form-error-message'>{errors.time.message}</span>}
              </div>
            </div>
            {!submitted && (
              <div className='mt-4 fw-light'>
                <i>Nhấn xác nhận để tiếp tục. Chúng tôi sẽ xếp lịch trên những thông tin bạn cung cấp.</i>
              </div>
            )}
          </div>
        </div>
        {!submitted && (
          <div className='d-flex justify-content-center mt-1'>
            <button type='submit' className='btn btn-primary btn-sm'>
              Xác nhận
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

type ScheduleInfo = {
  doctor?: string
  day?: string
  time?: string
  room?: string
}

export const StepTwoSchedule = (props: any) => {
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState<ScheduleInfo>()

  useEffect(() => {
    const getStats = async () => {
      // const stats = await getData()
      // const filteredFlights = flights.filter((item) => item.Status === null);
    }
    getStats()
  }, [])

  return (
    <div className='stats'>
      <div className='column-left'>
        <p> Bác sĩ</p>
        <p> Ngày khám</p>
        <p> Thời gian</p>
        <p> Phòng khám</p>
      </div>
      <ClipLoader color={'#fff'} loading={loading} />
      <div className='column-right'>
        <p>: {loading ? '...........................' : info?.doctor}</p>
        <p>: {loading ? '...........................' : info?.day}</p>
        <p>: {loading ? '...........................' : info?.time}</p>
        <p>: {loading ? '...........................' : info?.room}</p>
      </div>
    </div>
  )
}
