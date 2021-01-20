import React, { useState } from 'react'
import ReactCustomStyledCalendar, {
  IStyleByDate
} from '../ReactCustomStyledCalendar'
import { format, isSameDay } from 'date-fns'

interface ReactCustomInputDateCalendarProps {}

const ReactCustomInputDateCalendar: React.FC<ReactCustomInputDateCalendarProps> = () => {
  const year = 2021
  const month = 1
  const isMultipleSelect = true

  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  const styleByDate = selectedDates.reduce((acc: IStyleByDate, date) => {
    return (
      (acc[format(date, 'yyyy-MM-dd')] = {
        capsuleBackgroundColor: 'DeepSkyBlue'
      }),
      acc
    )
  }, {})

  const onClick = !isMultipleSelect
    ? (date: Date) => setSelectedDates([date])
    : (date: Date) => {
        const datesWithoutClickedDate = selectedDates.filter(
          (d) => !isSameDay(d, date)
        )
        const isDateInSelectedDates =
          datesWithoutClickedDate.length < selectedDates.length
        if (isDateInSelectedDates) {
          setSelectedDates(datesWithoutClickedDate)
        } else {
          setSelectedDates([...selectedDates, date])
        }
      }

  return (
    <ReactCustomStyledCalendar
      year={year}
      month={month}
      styleByDate={styleByDate}
      extraDayStyleByDate={styleByDate}
      onClick={onClick}
      bodyBackground='whitesmoke'
    />
  )
}

export default React.memo(ReactCustomInputDateCalendar)
