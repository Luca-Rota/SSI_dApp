import { Modal, Button } from "react-bootstrap";

function LoginModal(props) {
  
  return (
    <Modal size="md" className="vc-modal" show={props.showInfoModal}>
      <Modal.Header className='modalHeaderBorder'>
      <Modal.Title className='modalTitle'> Useful information for Log In as visitor </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBodyBorder overflow-auto'>
				<h6 className='mb-3'> You can access the Data Cellar site as a visitor. </h6>
				<h5 className='mb-2 formText'> Prerequisites: </h5>
				<h6  className='mb-3'> To do this you will need to have downloaded the MetaMask browser extension and have within the wallet at least one Ethereum account with which to connect. </h6>
				<h5 className='mb-2 formText'> What can you do next: </h5>
				<h6 className='mb-3'> As a visitor you will be able to safely visit Data Cellar, but you will not be able to perform some operations; to do so, you will have to register with the site and sign in as a member.  </h6>
				<h5 className='mb-2 formText'> Note: </h5>
				<h6 className='mb-3'> Remember, that if you want to be able to sign up and/or sign in as a member, you must use the MetaMask wallet to connect.  </h6>
			</Modal.Body>
      <Modal.Footer className='modalFooterBorder'>
        <Button variant="danger" onClick={() => props.setShowInfoModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;