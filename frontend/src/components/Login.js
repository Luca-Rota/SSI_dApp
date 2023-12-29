import { useState } from 'react';
import { Button, Col, Row, Container, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'
import video from '../assets/video.mp4';
import { default as Info } from "../assets/info.svg";
import LoginModal from './LoginModal';

function Login() {

  const [showInfoModal, setShowInfoModal] = useState(false);

  const { hasProvider, isConnecting, connectMetaMask } = useMetaMask()

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Get info!
    </Tooltip>
  );

  return (
    <Container className="home ">
      <video id="background-video" className="w-100" autoPlay loop muted>
        <source src={video} type="video/mp4" allowFullScreen />
        Your browser does not support the video tag.
      </video>

      {showInfoModal && <LoginModal showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal} />}

      <Modal className=' my-custom-modal static-modal' size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={true} >
        <Container fluid className="signup">
          <Row>
            <Col md={{ span: 8, offset: 2 }} className='my-2'>
              <img className='logo mt-3' src={Logo} alt="logo" />
            </Col>
          </Row>
          <Row className='mx-2 mt-1'>
            <h2 className='formText'> Authentication </h2>
          </Row>
          <Row className='ms-3 mb-4'>
            <h6 className='h6-info'>Log in as a visitor using an account in your MetaMask wallet. </h6>
            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
              <img src={Info} alt="info" className='info' onClick={() => setShowInfoModal(true)} />
            </OverlayTrigger>
          </Row>
          <Row className='box-center mb-4 pb-2'>
            {(!hasProvider || !window.ethereum?.isMetaMask) ?
              <Button className="metamask-btn mt-3" onClick={() => { window.open('https://metamask.io', '_blank') }}> Install MetaMask </Button> :
              <Button className="signup-btn mt-3" disabled={isConnecting} onClick={connectMetaMask}>
                {isConnecting ? "Loading" : "Connect"}
              </Button>
            }
          </Row>
        </Container>
      </Modal>
    </Container>
  );
}

export default Login;