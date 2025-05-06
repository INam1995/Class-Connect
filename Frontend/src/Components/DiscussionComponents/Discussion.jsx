import React from 'react'
import QuoraHeader from '../QuoraHeader'
import "./css/Quora.css"
import Sidebar from '../Slider/Sidebar'
import Feed from './Feed'
import Widget from '../Widget'


function Discussion() {
  return (
    <div className='quora'>         
        <QuoraHeader />
        <div className="quora__contents">
        <div className="quora__content">
          <Sidebar />
          <Feed />
          <Widget />
        </div>
      </div>
    </div>
  )
}

export default Discussion