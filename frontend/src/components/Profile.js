
import { Col, Row, Container, Button } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './DeleteUserModal';
import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'

function Profile(props) {

  const [showDelete, setShowDelete] = useState(false);

  const { isConnecting } = useMetaMask();

  return (
    <Container fluid className="mt-5 pt-5">

      {showDelete && <DeleteUserModal setShowDelete={setShowDelete} showDelete={showDelete} handleLoggedOut={props.handleLoggedOut} />}

      <Row>
        <Col md={12} >
          <Row>
            <Col md={{ span: 8, offset: 2 }} className='my-2'>
              <img className='logo' src={Logo} alt="logo" />
            </Col>
          </Row>
          <Row className='mx-2 mt-1 mb-5'>
            <h2 className='formText'> Profile </h2>
          </Row>
          <Row>
            <Col md={3}>
              <img src={User} alt="user" className="profile-img" />
            </Col>
            <Col md={7}>
              <Row className="mb-2">
                <Col md={3}>
                  <h4 className="h4-profile"> Address:</h4>
                </Col>
                <Col md={8}>
                  <h6 className="h5-profile"> {props.authState.publicAddress} </h6>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h4 className="h4-profile"> Name:</h4>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState.name} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h4 className="h4-profile"> Surname:</h4>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState.surname} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h4 className="h4-profile"> Email:</h4>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState.email} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h4 className="h4-profile"> Profession:</h4>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState.profession} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h4 className="h4-profile"> Country:</h4>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState.country} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h4 className="h4-profile"> Region:</h4>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState.region} </h5>
                </Col>
              </Row>
            </Col>
            <Col md={2} className="end">
              <Button className='exit delete' onClick={() => setShowDelete(true)} disabled={isConnecting} >
                {isConnecting ? "Loading" : "Delete Account"}
              </Button>
            </Col>
          </Row>
          <Row className="mt-5 mb-3">
            <p className="p-signup"> NOTE: This information is taken from your session cookie. Data Cellar does not store any of your information. </p>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;