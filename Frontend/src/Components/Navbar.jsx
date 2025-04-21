import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useAuth } from "./AuthContext"; // ✅ Ensure the path is correct


function NavbarComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // ✅ Now `useNavigate()` is inside a Router component

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // ✅ Redirect to home page
  };

  // Handle redirect to Class Notes page
  const handleClassNotesRedirect = () => {
    navigate("/class-notes/upload"); // Change this route if your ClassNotesPage has a different route
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Ed-Tech Platform</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/features">Features</Nav.Link>
          <Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
          <Nav.Link as={Link} to="/discussion">Discussion</Nav.Link>

          {/* Class Notes Menu */}
          <Nav.Link onClick={handleClassNotesRedirect} style={{ cursor: "pointer" }}>
            Class Notes
          </Nav.Link>
        </Nav>
        <Nav>
          {user ? ( // ✅ Show profile icon if logged in
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="profile-dropdown" style={{ color: "white" }}>
                <div
                  className="profile-icon"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white" }}>👤</span>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item disabled>{user?.username || "User"}</Dropdown.Item>
                <Dropdown.Item disabled>{user?.email || "No email"}</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link as={Link} to="/register">SignUp/SignIn</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
