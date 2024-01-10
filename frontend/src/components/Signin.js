import { useState } from 'react';
import { Button, Col, Row, Container, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'
import API from '../hooks/API'
import video from '../assets/video.mp4';
import SigninModal from './SigninModal';
import { default as Info } from "../assets/info.svg";
import { verifyVc } from '../hooks/utils';

function Signin(props) {

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [file, setFile] = useState(null);

  const { wallet, setErrorMessage, isConnecting, signJWT, setIsConnecting, isRegistered } = useMetaMask();

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Get info!
    </Tooltip>
  );

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const readAndHandleFile = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        try {
          const parsedContent = JSON.parse(fileContent);
          const jwt = parsedContent?.proof?.jwt;
          if (jwt) {
            resolve(jwt);
          } else {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const checkVcOwnership = (idVc) => {
    const lowercaseIdVc = idVc.toLowerCase();
    const lowercaseAddress = wallet.accounts[0].toLowerCase();
    return lowercaseIdVc.includes(lowercaseAddress);
  };

  const handleSignIn = async () => {
    setIsConnecting(true);
    if (file) {
      try {
        const vcJwt = await readAndHandleFile();
        if (vcJwt) {
          if (await isRegistered()) {
            const verifiedVC = await verifyVc(vcJwt, wallet.chainId);
            if (verifiedVC) {
              if (checkVcOwnership(verifiedVC.verifiableCredential.credentialSubject.id)) {
                const jwt = await signJWT();
                if (jwt) {
                  const name = verifiedVC.verifiableCredential.credentialSubject.name;
                  const surname = verifiedVC.verifiableCredential.credentialSubject.surname;
                  const email = verifiedVC.verifiableCredential.credentialSubject.email;
                  const profession = verifiedVC.verifiableCredential.credentialSubject.profession;
                  const country = verifiedVC.verifiableCredential.credentialSubject.country;
                  const region = verifiedVC.verifiableCredential.credentialSubject.region;
                  const credentials = { name, surname, email, profession, country, region }
                  const auth = await API.handleAuthenticate(jwt.signature, wallet.accounts[0], jwt.nonce, credentials);
                  props.handleLoggedIn(auth, wallet.accounts[0], credentials);
                }
              } else {
                setErrorMessage('The verifiable credential you provided is not associated with your account.');
              }
            } else {
              setErrorMessage('Verification of your verifiable credential has failed.');
            }
          } else {
            setErrorMessage('Your selected account is not registered to DataCellar with the blockchain you selected. Maybe you were registered using a different network.')
          }
        } else {
          setErrorMessage('The file provided is not a verifiable credential.');
        }
      } catch (err) {
        setErrorMessage(err.message);
      }
    } else {
      setErrorMessage(`Please upload your DataCellar's verifiable credential first.`);
    }
    setIsConnecting(false);
  }

  return (
    <Container className="home ">
      <video id="background-video" className="w-100" autoPlay loop muted>
        <source src={video} type="video/mp4" allowFullScreen />
        Your browser does not support the video tag.
      </video>

      {showInfoModal && <SigninModal showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal} />}

      <Modal className=' my-custom-modal static-modal' size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={true} >
        <Container fluid className="signup">
          <Row>
            <Col md={{ span: 8, offset: 2 }} className='my-2'>
              <img className='logo mt-3' src={Logo} alt="logo" />
            </Col>
          </Row>
          <Row className='mx-2 mt-1'>
            <h2 className='formText'> Sign In </h2>
          </Row>
          <Row className='ms-4 mb-3'>
            <h6 className='h6-info'>Sign in as a member using an account in your MetaMask wallet. </h6>
            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
              <img src={Info} alt="info" className='info' onClick={() => setShowInfoModal(true)} />
            </OverlayTrigger>
          </Row>
          <Row className='ms-4 mb-4'>
            <h6 className='h6-info'>Upload your DataCellar's verifiable credential: </h6>
            <input id="file" type="file" onChange={handleFileChange} className='file' />
          </Row>
          <Row className='box-center mb-4 pb-2'>
            <Button className="signup-btn mt-3" disabled={isConnecting} onClick={() => handleSignIn()}>
              {isConnecting ? "Loading" : "Sign In"}
            </Button>
          </Row>
        </Container>
      </Modal>
    </Container>
  );
}

export default Signin;