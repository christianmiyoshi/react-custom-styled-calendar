import React, { useState, useMemo } from 'react'
import ReactCustomStyledCalendar, {
  IStyleByDate
} from '../ReactCustomStyledCalendar'
import { format, isSameDay } from 'date-fns'

interface ReactCustomInputDateCalendarProps {
  month: number
  year: number
  color?: string
}

const ReactCustomInputDateCalendar: React.FC<ReactCustomInputDateCalendarProps> = ({
  month,
  year,
  color = 'DeepSkyBlue'
}) => {
  const isMultipleSelect = true

  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  const selectedStyle = useMemo(
    () => ({
      capsuleBackgroundColor: color || 'DeepSkyBlue'
    }),
    [color]
  )

  const styleByDate = selectedDates.reduce((acc, date) => {
    acc[format(date, 'yyyy-MM-dd')] = selectedStyle
    return acc
  }, {} as IStyleByDate)

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
    />
  )
}

export default React.memo(ReactCustomInputDateCalendar)
