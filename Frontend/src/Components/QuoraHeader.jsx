// // // import React, { useState } from "react";
// // // import HomeIcon from "@mui/icons-material/Home";
// // // import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";
// // // import SearchIcon from "@mui/icons-material/Search"; // Fixed
// // // import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// // // import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// // // import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// // // import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// // // import CloseIcon from "@mui/icons-material/Close"; // Added
// // // import { Avatar, Button, Input } from "@mui/material";

// // // import "./css/QuoraHeader.css";
// // // import { Modal } from "react-responsive-modal";
// // // import "react-responsive-modal/styles.css";
// // // import api from "../api.js";
// // // import { useAuth } from "./AuthContext";

// // // function QuoraHeader() {
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [inputUrl, setInputUrl] = useState("");
// // //   const [question, setQuestion] = useState("");
// // //   const { user, isLoggedIn, logout } = useAuth();

// // //   const handleSubmit = async () => {
// // //     if (!isLoggedIn) {
// // //       alert("You must be logged in to add a question.");
// // //       return;
// // //     }
// // //     if (question !== "") {
// // //       const config = {
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //       };
// // //       const body = {
// // //         questionName: question,
// // //         questionUrl: inputUrl,
// // //         user,
// // //       };
// // //       try {
// // //         const res = await api.post("/api/question", body, config);
// // //         alert(res.data.message);
// // //         // window.location.href = "/";
// // //       } catch (e) {
// // //         console.error(e);
// // //         alert("Error in adding question");
// // //       }
// // //     }
// // //   };

// // //   const handleLogout = () => {
// // //     if (window.confirm("Are you sure you want to logout?")) {
// // //       logout();
// // //       console.log("Logged out");
// // //     }
// // //   };

// // //   return (
// // //     <div className="qHeader">
// // //       <div className="qHeader-content">
// // //         <div className="qHeader__logo">
// // //           <img
// // //             src="https://upload.wikimedia.org/wikipedia/commons/1/18/Wikipedia20_animated_Plane.gif"
// // //             alt="logo"
// // //           />
// // //         </div>
// // //         <div className="qHeader__icons">
// // //           <div className="qHeader__icon">
// // //             <HomeIcon />
// // //           </div>
// // //           <div className="qHeader__icon">
// // //             <FeaturedPlayListOutlinedIcon />
// // //           </div>
// // //           <div className="qHeader__icon">
// // //             <AssignmentTurnedInOutlinedIcon />
// // //           </div>
// // //           <div className="qHeader__icon">
// // //             <PeopleAltOutlinedIcon />
// // //           </div>
// // //           <div className="qHeader__icon">
// // //             <NotificationsOutlinedIcon />
// // //           </div>
// // //         </div>
// // //         <div className="qHeader__input">
// // //           <SearchIcon />
// // //           <input type="text" placeholder="Search questions" />
// // //         </div>
// // //         <div className="qHeader__Rem">
// // //           {isLoggedIn ? (
// // //             <>
// // //               <span onClick={handleLogout}>
// // //                 <Avatar src={user?.photo} />
// // //               </span>
// // //               <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
// // //             </>
// // //           ) : (
// // //             <p>Please log in</p>
// // //           )}
// // //           <Modal
// // //             open={isModalOpen}
// // //             closeIcon={<CloseIcon />}
// // //             onClose={() => setIsModalOpen(false)}
// // //             closeOnEsc
// // //             center
// // //             closeOnOverlayClick={false}
// // //             styles={{ overlay: { height: "auto" } }}
// // //           >
// // //             <div className="modal__title">
// // //               <h5>Add Question</h5>
// // //               <h5>Share Link</h5>
// // //             </div>
// // //             <div className="modal__info">
// // //               <Avatar className="avatar" />
// // //               <div className="modal__scope">
// // //                 <PeopleAltOutlinedIcon />
// // //                 <p>Public</p>
// // //                 <ExpandMoreIcon />
// // //               </div>
// // //             </div>
// // //             <div className="modal__Field">
// // //               <Input
// // //                 onChange={(e) => setQuestion(e.target.value)}
// // //                 value={question}
// // //                 type="text"
// // //                 placeholder="Start your question with 'What', 'How', 'Why', etc. "
// // //               />
// // //               <div style={{ display: "flex", flexDirection: "column" }}>
// // //                 <input
// // //                   type="text"
// // //                   value={inputUrl}
// // //                   onChange={(e) => setInputUrl(e.target.value)}
// // //                   style={{
// // //                     margin: "5px 0",
// // //                     border: "1px solid lightgray",
// // //                     padding: "10px",
// // //                     outline: "2px solid #000",
// // //                   }}
// // //                   placeholder="Optional: include a link that gives context"
// // //                 />
// // //                 {inputUrl !== "" && (
// // //                   <img
// // //                     style={{ height: "40vh", objectFit: "contain" }}
// // //                     src={inputUrl}
// // //                     alt="displayimage"
// // //                   />
// // //                 )}
// // //               </div>
// // //             </div>
// // //             <div className="modal__buttons">
// // //               <button className="cancel" onClick={() => setIsModalOpen(false)}>
// // //                 Cancel
// // //               </button>
// // //               <button onClick={handleSubmit} type="submit" className="add">
// // //                 Add Question
// // //               </button>
// // //             </div>
// // //           </Modal>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default QuoraHeader;
// // import React, { useState } from "react";
// // import HomeIcon from "@mui/icons-material/Home";
// // import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";
// // import SearchIcon from "@mui/icons-material/Search";
// // import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// // import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// // import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// // import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// // import CloseIcon from "@mui/icons-material/Close";
// // import { Avatar, Button, Input } from "@mui/material";
// // import { Modal } from "react-responsive-modal";
// // import "react-responsive-modal/styles.css";
// // import api from "../api.js";
// // import { useAuth } from "./AuthContext";

// // function QuoraHeader({ fetchQuestions }) {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [inputUrl, setInputUrl] = useState("");
// //   const [question, setQuestion] = useState("");
// //   const { user, isLoggedIn, logout } = useAuth();

// //   const handleSubmit = async () => {
// //     if (!isLoggedIn) {
// //       alert("You must be logged in to add a question.");
// //       return;
// //     }

// //     if (question.trim() !== "") {
// //       try {
// //         const res = await api.post(
// //           "/api/question",
// //           { questionName: question, questionUrl: inputUrl },
// //           { headers: { Authorization: `Bearer ${user.token}` } } // ✅ Send token
// //         );

// //         alert("Question posted successfully!");
// //         setQuestion("");
// //         setInputUrl("");
// //         setIsModalOpen(false);

// //         if (fetchQuestions) {
// //           fetchQuestions(); // ✅ Refresh questions after posting
// //         }
// //       } catch (error) {
// //         console.error("Error posting question:", error);
// //         alert("Error in adding question");
// //       }
// //     }
// //   };

// //   const handleLogout = () => {
// //     if (window.confirm("Are you sure you want to logout?")) {
// //       logout();
// //       console.log("Logged out");
// //     }
// //   };

// //   return (
// //     <div className="qHeader">
// //       <div className="qHeader-content">
// //         <div className="qHeader__logo">
// //           <img
// //             src="https://upload.wikimedia.org/wikipedia/commons/1/18/Wikipedia20_animated_Plane.gif"
// //             alt="logo"
// //           />
// //         </div>
// //         <div className="qHeader__icons">
// //           <div className="qHeader__icon">
// //             <HomeIcon />
// //           </div>
// //           <div className="qHeader__icon">
// //             <FeaturedPlayListOutlinedIcon />
// //           </div>
// //           <div className="qHeader__icon">
// //             <AssignmentTurnedInOutlinedIcon />
// //           </div>
// //           <div className="qHeader__icon">
// //             <PeopleAltOutlinedIcon />
// //           </div>
// //           <div className="qHeader__icon">
// //             <NotificationsOutlinedIcon />
// //           </div>
// //         </div>
// //         <div className="qHeader__input">
// //           <SearchIcon />
// //           <input type="text" placeholder="Search questions" />
// //         </div>
// //         <div className="qHeader__Rem">
// //           {isLoggedIn ? (
// //             <>
// //               <span onClick={handleLogout}>
// //                 <Avatar src={user?.photo} />
// //               </span>
// //               <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
// //             </>
// //           ) : (
// //             <p>Please log in</p>
// //           )}
// //           <Modal
// //             open={isModalOpen}
// //             closeIcon={<CloseIcon />}
// //             onClose={() => setIsModalOpen(false)}
// //             closeOnEsc
// //             center
// //             closeOnOverlayClick={false}
// //             styles={{ overlay: { height: "auto" } }}
// //           >
// //             <div className="modal__title">
// //               <h5>Add Question</h5>
// //               <h5>Share Link</h5>
// //             </div>
// //             <div className="modal__info">
// //               <Avatar className="avatar" />
// //               <div className="modal__scope">
// //                 <PeopleAltOutlinedIcon />
// //                 <p>Public</p>
// //                 <ExpandMoreIcon />
// //               </div>
// //             </div>
// //             <div className="modal__Field">
// //               <Input
// //                 onChange={(e) => setQuestion(e.target.value)}
// //                 value={question}
// //                 type="text"
// //                 placeholder="Start your question with 'What', 'How', 'Why', etc. "
// //               />
// //               <div style={{ display: "flex", flexDirection: "column" }}>
// //                 <input
// //                   type="text"
// //                   value={inputUrl}
// //                   onChange={(e) => setInputUrl(e.target.value)}
// //                   style={{
// //                     margin: "5px 0",
// //                     border: "1px solid lightgray",
// //                     padding: "10px",
// //                     outline: "2px solid #000",
// //                   }}
// //                   placeholder="Optional: include a link that gives context"
// //                 />
// //                 {inputUrl !== "" && (
// //                   <img
// //                     style={{ height: "40vh", objectFit: "contain" }}
// //                     src={inputUrl}
// //                     alt="displayimage"
// //                   />
// //                 )}
// //               </div>
// //             </div>
// //             <div className="modal__buttons">
// //               <button className="cancel" onClick={() => setIsModalOpen(false)}>
// //                 Cancel
// //               </button>
// //               <button onClick={handleSubmit} type="submit" className="add">
// //                 Add Question
// //               </button>
// //             </div>
// //           </Modal>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default QuoraHeader;
// // import React, { useState } from "react";
// // import HomeIcon from "@material-ui/icons/Home";
// // import FeaturedPlayListOutlinedIcon from "@material-ui/icons/FeaturedPlayListOutlined";
// // import {
// //   AssignmentTurnedInOutlined,
// //   NotificationsOutlined,
// //   PeopleAltOutlined,
// //   Search,
// //   ExpandMore,
// // } from "@material-ui/icons";
// // import CloseIcon from "@material-ui/icons/Close";
// // import { Button, Input } from "@material-ui/core";
// // import "./css/QuoraHeader.css";
// // import { Modal } from "react-responsive-modal";
// // import "react-responsive-modal/styles.css";
// // import api from "../api";
// import React, { useState } from "react";
// import HomeIcon from "@mui/icons-material/Home";
// import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";
// import SearchIcon from "@mui/icons-material/Search"; // Fixed
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import CloseIcon from "@mui/icons-material/Close"; // Added
// import { Avatar, Button, Input } from "@mui/material";

// import "./css/QuoraHeader.css";
// import { Modal } from "react-responsive-modal";
// import "react-responsive-modal/styles.css";
// import api from "../api.js";
// //import { useAuth } from "./AuthContext";

// function QuoraHeader() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [inputUrl, setInputUrl] = useState("");
//   const [question, setQuestion] = useState("");
//   const Close = <CloseIcon />;

//   const handleSubmit = async () => {
//     if (question !== "") {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };
//       const body = {
//         questionName: question,
//         questionUrl: inputUrl,
//       };
//       await api
//         .post("/api/questions", body, config)
//         .then((res) => {
//           console.log(res.data);
//           alert(res.data.message);
//           window.location.href = "/";
//         })
//         .catch((e) => {
//           console.log(e);
//           alert("Error in adding question");
//         });
//     }
//   };

//   return (
//     <div className="qHeader">
//       <div className="qHeader-content">
//         <div className="qHeader__logo">
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/1/18/Wikipedia20_animated_Plane.gif"
//             alt="logo"
//           />
//         </div>
//         <div className="qHeader__icons">
//           <div className="qHeader__icon">
//             <HomeIcon />
//           </div>
//           <div className="qHeader__icon">
//             <FeaturedPlayListOutlinedIcon />
//           </div>
//           <div className="qHeader__icon">
//             <AssignmentTurnedInOutlined />
//           </div>
//           <div className="qHeader__icon">
//             <PeopleAltOutlined />
//           </div>
//           <div className="qHeader__icon">
//             <NotificationsOutlined />
//           </div>
//         </div>
//         <div className="qHeader__input">
//           <Search />
//           <input type="text" placeholder="Search questions" />
//         </div>
//         <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
//         <Modal
//           open={isModalOpen}
//           closeIcon={Close}
//           onClose={() => setIsModalOpen(false)}
//           closeOnEsc
//           center
//           closeOnOverlayClick={false}
//           styles={{
//             overlay: { height: "auto" },
//           }}
//         >
//           <div className="modal__title">
//             <h5>Add Question</h5>
//             <h5>Share Link</h5>
//           </div>
//           <div className="modal__Field">
//             <Input
//               onChange={(e) => setQuestion(e.target.value)}
//               value={question}
//               type="text"
//               placeholder="Start your question with 'What', 'How', 'Why', etc."
//             />
//             <input
//               type="text"
//               value={inputUrl}
//               onChange={(e) => setInputUrl(e.target.value)}
//               placeholder="Optional: include a link that gives context"
//             />
//             {inputUrl && <img src={inputUrl} alt="display" style={{ height: "40vh" }} />}
//           </div>
//           <div className="modal__buttons">
//             <button className="cancel" onClick={() => setIsModalOpen(false)}>
//               Cancel
//             </button>
//             <button onClick={handleSubmit} type="submit" className="add">
//               Add Question
//             </button>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// }

// export default QuoraHeader;
import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined"; // ✅ FIXED IMPORT
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CloseIcon from "@mui/icons-material/Close"; // ✅ FIXED IMPORT
import { Avatar, Button, Input } from "@mui/material";

import "./css/QuoraHeader.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import api from "../api.js";

function QuoraHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const Close = <CloseIcon />;

  const handleSubmit = async () => {
    if (question !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        questionName: question,
        questionUrl: inputUrl,
      };
      await api
        .post("/api/questions", body, config)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          window.location.href("/");
        })
        .catch((e) => {
          console.log(e);
          alert("Error in adding question");
        });
    }
  };

  return (
    <div className="qHeader">
      <div className="qHeader-content">
        <div className="qHeader__logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/18/Wikipedia20_animated_Plane.gif"
            alt="logo"
          />
        </div>
        <div className="qHeader__icons">
          <div className="qHeader__icon">
            <HomeIcon />
          </div>
          <div className="qHeader__icon">
            <FeaturedPlayListOutlinedIcon />
          </div>
          <div className="qHeader__icon">
            <AssignmentTurnedInOutlinedIcon /> {/* ✅ FIXED HERE */}
          </div>
          <div className="qHeader__icon">
            <PeopleAltOutlinedIcon /> {/* ✅ FIXED HERE */}
          </div>
          <div className="qHeader__icon">
            <NotificationsOutlinedIcon /> {/* ✅ FIXED HERE */}
          </div>
        </div>
        <div className="qHeader__input">
          <SearchIcon /> {/* ✅ FIXED HERE */}
          <input type="text" placeholder="Search questions" />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
        <Modal
          open={isModalOpen}
          closeIcon={Close}
          onClose={() => setIsModalOpen(false)}
          closeOnEsc
          center
          closeOnOverlayClick={false}
          styles={{
            overlay: { height: "auto" },
          }}
        >
          <div className="modal__title">
            <h5>Add Question</h5>
            <h5>Share Link</h5>
          </div>
          <div className="modal__Field">
            <Input
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              type="text"
              placeholder="Start your question with 'What', 'How', 'Why', etc."
            />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Optional: include a link that gives context"
            />
            {inputUrl && <img src={inputUrl} alt="display" style={{ height: "40vh" }} />}
          </div>
          <div className="modal__buttons">
            <button className="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button onClick={handleSubmit} type="submit" className="add">
              Add Question
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default QuoraHeader;
