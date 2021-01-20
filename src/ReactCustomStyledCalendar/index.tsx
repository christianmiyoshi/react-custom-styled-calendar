import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  startOfWeek,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getWeek,
  addDays,
  getMonth,
  endOfWeek
} from 'date-fns'

import { groupBy, take } from 'lodash'

const Container = styled.div``

const MonthLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 10px;
`

type ReactCustomStyledCalendarProps = {
  month: number
  year: number
  showYear?: boolean
  onClick?: (date: Date) => void
  styleByDate?: {
    [date: string]: {
      fontColor?: string
      leftBackgroundColor?: string
      rightBackgroundColor?: string
      capsuleBackgroundColor?: string
    }
  }
  extraDayStyleByDate?: {
    [date: string]: {
      fontColor?: string
      leftBackgroundColor?: string
      rightBackgroundColor?: string
      capsuleBackgroundColor?: string
    }
  }
  dayColor?: string
  extraDayColor?: string
  showExtraDays?: boolean
  showSixWeeks?: boolean
  bodyBackground?: string
  headerBackground?: string
}

const emptyFunction = () => {}

const calculateDatesToShowInMonth = (
  year: number,
  month: number,
  showSixWeeks: boolean
) => {
  const firstDateOfMonth = new Date(year, month, 1)
  const startMonth = startOfMonth(firstDateOfMonth)
  const endMonth = endOfMonth(startMonth)

  const weekStart = startOfWeek(startMonth)
  const weekEnd = endOfWeek(showSixWeeks ? addDays(endMonth, 14) : endMonth)

  const dates = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  })

  const numberOfWeeks = 6
  const numberOfDaysInWeek = 7
  const datesToShow = take(dates, numberOfDaysInWeek * numberOfWeeks)
  const daysGroupedByWeek = groupBy(datesToShow, (date) => getWeek(date))

  return {
    startMonth,
    endMonth,
    weekStart,
    weekEnd,
    dates,
    daysGroupedByWeek
  }
}

const ReactCustomStyledCalendar: React.FC<ReactCustomStyledCalendarProps> = ({
  month,
  year,
  showYear = true,
  onClick = emptyFunction,
  dayColor = '#000000',
  extraDayColor = '#aaaaaa',
  styleByDate = {},
  extraDayStyleByDate = {},
  showExtraDays = true,
  showSixWeeks = true,
  bodyBackground = '#ff00ff',
  headerBackground = '#00ffff'
}) => {
  const { startMonth, daysGroupedByWeek } = useMemo(
    () => calculateDatesToShowInMonth(year, month, showSixWeeks),
    [year, month, showSixWeeks]
  )

  return (
    <Container>
      <MonthLabel>
        {format(startMonth, `MMMM${showYear ? ' y' : ''}`)}
      </MonthLabel>
      <table
        cellPadding='0'
        style={{
          width: '100%',
          tableLayout: 'fixed',
          borderSpacing: 0
        }}
      >
        <thead style={{ backgroundColor: headerBackground }}>
          <tr>
            {Object.values(daysGroupedByWeek)[0].map((date) => (
              <th key={format(date, 'd')} style={{ width: '14%' }}>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '5px 0 5px 0',
                    // backgroundColor: 'orange',
                    fontSize: '10px'
                  }}
                >
                  {format(date, 'EEE')}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: bodyBackground }}>
          {Object.entries(daysGroupedByWeek).map(([index, week]) => {
            return (
              <tr key={index}>
                {week.map((date) => {
                  const isExtraDay = getMonth(date) !== month
                  const isNormalDay = !isExtraDay
                  const style = isNormalDay
                    ? styleByDate[format(date, 'yyyy-MM-dd')]
                    : extraDayStyleByDate[format(date, 'yyyy-MM-dd')]

                  const defaultColor = isNormalDay ? dayColor : extraDayColor

                  return (
                    <td key={format(date, 'd')}>
                      {(isNormalDay || showExtraDays) && (
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px'
                            // marginBottom: '5px',
                            // backgroundColor: 'blue'
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              backgroundColor: style?.leftBackgroundColor,
                              width: '50%',
                              height: '100%',
                              top: 0,
                              left: 0,
                              zIndex: 1
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              backgroundColor: style?.rightBackgroundColor,
                              width: '50%',
                              height: '100%',
                              top: 0,
                              right: 0,
                              zIndex: 1
                            }}
                          />
                          <div
                            color='primary'
                            style={{
                              zIndex: 2,
                              display: 'flex',
                              justifyContent: 'center',
                              fontSize: '14px',
                              backgroundColor: style?.capsuleBackgroundColor,
                              borderRadius: '20px',
                              alignItems: 'center',
                              width: '40px',
                              height: '40px',
                              color: style?.fontColor || defaultColor
                            }}
                            onClick={() => onClick(date)}
                          >
                            {format(date, 'd')}
                          </div>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </Container>
  )
}

export default React.memo(ReactCustomStyledCalendar)
