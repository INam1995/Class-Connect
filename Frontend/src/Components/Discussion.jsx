// import React from "react";
// import { useParams } from "react-router-dom";

// const Discussion = () => {
//   const { folderId } = useParams();

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold">Discussion for Folder</h1>
//       <p>Start your discussion here...</p>
//     </div>
//   );
// };

// export default Discussion;
import React from 'react'
import QuoraHeader from './QuoraHeader'
import "./css/Quora.css"
import Sidebar from './Sidebar'
import Feed from './Feed'
import Widget from './Widget'


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