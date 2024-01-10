import { useState } from 'react';
import { Button, Col, Form, Row, Container, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as Info } from "../assets/info.svg";
import { useMetaMask } from '../hooks/useMetaMask'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import API from '../hooks/API'
import { formatNetwork, validateEmail, validateName, validateProfession, validateSurname } from '../hooks/utils';
import video from '../assets/video.mp4';
import SignupModal from './SignupModal';
import VcModal from './VcModal';
import SignupConfirmModal from './SignupConfirmModal';

function SignUp(props) {

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [credentials, setCredentials] = useState('');

  const { wallet, setErrorMessage, isConnecting, opCompleted, signupDataCellar, setIsConnecting } = useMetaMask()

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Get info!
    </Tooltip>
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (!validateName(name.trim())) {
      setErrorMessage('Invalid name.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setErrorMessage('Invalid email.');
      return;
    }
    if (!validateSurname(surname.trim())) {
      setErrorMessage('Invalid surname.');
      return;
    }
    if (!validateProfession(profession.trim())) {
      setErrorMessage('Invalid profession.');
      return;
    }
    setCredentials({ name, surname, email, profession, selectedCountry, selectedRegion });
    setShowRegister(true);
  }

  const handleSignUp = async () => {
    setIsConnecting(true);
    try {
      const publicAddress = wallet.accounts[0];
      const chainId = wallet.chainId;
      if (chainId === "0x5" || chainId === "0xaa36a7") {
        const res = await signupDataCellar();
        if (res) {
          const vcCreated = await API.createVC(credentials, publicAddress, chainId);
          props.handleVcCreation(vcCreated);
        }
      } else {
        setErrorMessage("For now, only the Goerli and Sepolia networks can be used. Select another network.")
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
    setIsConnecting(false);
  }

  return (

    <Container className="home ">
      <video id="background-video" className="w-100" autoPlay loop muted>
        <source src={video} type="video/mp4" allowFullScreen />
        Your browser does not support the video tag.
      </video>

      {opCompleted && <VcModal vc={props.vc} setVc={props.setVc} downloaded={downloaded} setDownloaded={setDownloaded} />}
      {showInfoModal && <SignupModal showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal} />}
      {showRegister && <SignupConfirmModal showRegister={showRegister} setShowRegister={setShowRegister} handleSignUp={handleSignUp} /> }
     
      <Modal className=' my-custom-modal static-modal mt-5' size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={true} >
        <Container className="signup ">
          <Row>
            <Col md={{ span: 8, offset: 2 }} className='my-2'>
              <img className='logo mt-2' src={Logo} alt="logo" />
            </Col>
          </Row>
          <Row className='mx-2 '>
            <h2 className='formText' >Sign Up </h2>
          </Row>
          <Row className='ms-4 mb-2'>
            <h6 className='h6-info'>Read more information about the sign up process. </h6>
            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
              <img src={Info} alt="info" className='info' onClick={() => setShowInfoModal(true)} />
            </OverlayTrigger>
          </Row>
          <Form onSubmit={handleSubmit}>
            <Row className=' mx-2 '>
              <Col md={6} sm={6} xs={6} className='box_center'>
                <Form.Group controlId="address" autoFocus className='mb-3'>
                  <Form.Label className="form-label formText">Selected MetaMask Account: </Form.Label>
                  <Form.Control disabled type="text" placeholder={wallet.accounts[0]} className=' form-control dis-form' />
                </Form.Group>
              </Col>
              <Col md={6} sm={6} xs={6} className='box_center'>
                <Form.Group controlId="blockchain" autoFocus className='mb-3'>
                  <Form.Label className="form-label formText">Selected Blockchain: </Form.Label>
                  <Form.Control disabled type="text" placeholder={formatNetwork(wallet.chainId)} className=' form-control dis-form' />
                </Form.Group>
              </Col>
            </Row>
            <Row className=' mx-2 '>
              <Form.Label className="form-label formText">Additional Information: </Form.Label>
            </Row>
            <Row className='mt-1 mx-2 '>
              <Col md={6} sm={6} xs={6} className='box_center'>
                <Form.Group controlId="information" autoFocus >
                  <Form.Control required type="text" className='mb-2 ' placeholder="Name" value={name} onChange={ev => setName(ev.target.value)} />
                  <Form.Control required type="text" className='mb-2 ' placeholder="Surname" value={surname} onChange={ev => setSurname(ev.target.value)} />
                  <Form.Control required type="text" className='mb-2 ' placeholder="E-mail" value={email} onChange={ev => setEmail(ev.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6} sm={6} xs={6} className='box_center'>
                <Form.Group controlId="information" autoFocus >
                  <Form.Control required type="text" className='mb-2 ' placeholder="Profession" value={profession} onChange={ev => setProfession(ev.target.value)} />
                  <CountryDropdown
                    required
                    className='mb-2 custom-drop-country'
                    value={selectedCountry}
                    onChange={(val) => setSelectedCountry(val)}
                  />
                  <RegionDropdown
                    required
                    className='mb-2 custom-drop-country'
                    country={selectedCountry}
                    value={selectedRegion}
                    onChange={(val) => setSelectedRegion(val)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className='box-center mb-3 pb-2 mt-2'>
              <Button className="signup-btn mt-1" disabled={isConnecting} type="submit" >
                {isConnecting ? "Loading" : "Sign Up"}
              </Button>
            </Row>
          </Form>
        </Container>
      </Modal>
    </Container>
  );
}

export default SignUp;