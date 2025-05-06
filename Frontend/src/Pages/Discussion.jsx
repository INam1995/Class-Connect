import React from 'react'
import QuoraHeader from '../Components/DiscussionComponents/QuoraHeader.jsx'
// import "../Components/css/"
import Sidebar from '../Components/Slider/Sidebar.jsx'
import Feed from '../Components/DiscussionComponents/Feed.jsx'
import Widget from '../Components/DiscussionComponents/Widget.jsx'


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