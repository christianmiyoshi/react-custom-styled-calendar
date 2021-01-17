import React from 'react'

import { ReactCustomStyledCalendar } from 'react-custom-styled-calendar'
import 'react-custom-styled-calendar/dist/index.css'

const App = () => {
  return <ReactCustomStyledCalendar month={0} year={2021} styleByDate={{'2021-01-01': {backgroundColor: '#ff00aa'}}}/>
}

export default App
