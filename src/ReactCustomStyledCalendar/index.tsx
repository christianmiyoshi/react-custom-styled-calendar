import React, { useMemo, CSSProperties } from 'react'
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

const Container = styled.div`
  width: 300px;
`

const MonthLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`

type ReactCustomStyledCalendarProps = {
  month: number
  year: number
  showYear?: boolean
  onClick?: (date: Date) => void
  styleByDate?: { [date: string]: CSSProperties }
  extraDayStyleByDate?: { [date: string]: CSSProperties }
  dayColor?: string
  extraDayColor?: string
  showExtraDays?: boolean
  showSixWeeks?: boolean
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
  showSixWeeks = true
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
      <table style={{ width: '100%', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            {Object.values(daysGroupedByWeek)[0].map((date) => (
              <td
                key={format(date, 'd')}
                style={{ padding: '5px 0', width: '14%' }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '5px 0',
                    fontSize: '10px'
                  }}
                >
                  {format(date, 'EEE')}
                </div>
              </td>
            ))}
          </tr>

          {Object.entries(daysGroupedByWeek).map(([index, week]) => {
            return (
              <tr key={index}>
                {week.map((date) => {
                  const isExtraDay = getMonth(date) !== month
                  const isNormalDay = !isExtraDay

                  return (
                    <td
                      key={format(date, 'd')}
                      style={{ padding: '0px 0', margin: '5px' }}
                    >
                      {(isNormalDay || showExtraDays) && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <div
                            color='primary'
                            style={{
                              ...{ fontSize: '12px' },
                              ...(isNormalDay
                                ? {
                                    color: dayColor,
                                    ...styleByDate[format(date, 'yyyy-MM-dd')]
                                  }
                                : {
                                    color: extraDayColor,
                                    ...extraDayStyleByDate[
                                      format(date, 'yyyy-MM-dd')
                                    ]
                                  })
                            }}
                            onClick={() => onClick(date)}
                          >
                            <div
                              style={{
                                textAlign: 'center',
                                width: '16px'
                              }}
                            >
                              {format(date, 'd')}
                            </div>
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
