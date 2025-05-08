import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Row, Col, Table } from "react-bootstrap";

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserDetails(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching user profile data. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">User Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row>
            <Col>
              <h4>User Details</h4>
              <Table striped bordered hover responsive>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{userDetails.user.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{userDetails.user.email}</td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>{userDetails.user.role}</td>
                  </tr>
                  <tr>
                    <th>Files Uploaded</th>
                    <td>{userDetails.filesUploadedCount}</td>
                  </tr>
                  <tr>
                    <th>Files Downloaded</th>
                    <td>{userDetails.filesDownloadedCount}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col>
              <h4>Folders Created by User</h4>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Folder Name</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.createdFolders.map((folder) => (
                    <tr key={folder._id}>
                      <td>{folder.name}</td>
                      <td>{folder.members.length}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col>
              <h4>Folders Joined by User</h4>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Folder Name</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.joinedFolders.map((folder) => (
                    <tr key={folder._id}>
                      <td>{folder.name}</td>
                      <td>{folder.members.length}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Profile;
