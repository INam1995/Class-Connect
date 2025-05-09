import React from 'react'



function Discussion() {
  return (
    <div className='quora'>         
        <QuoraHeader />
        <div className="quora__contents">
        <div className="quora__content">
          
          <Feed />
          <Widget />
        </div>
      </div>
    </div>
  )
}

export default Discussion