import { Modal, Button } from "react-bootstrap";

function SignupModal(props) {

  return (
    <Modal size="md" className="vc-modal" show={props.showInfoModal}>
      <Modal.Header className='modalHeaderBorder'>
        <Modal.Title className='modalTitle'> Useful information for Sign Up </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBodyBorder overflow-auto'>
        <h6 className='mb-3'> Complete the sign up and become a member of Data Cellar. </h6>
        <h5 className='mb-2 formText'> Prerequisites: </h5>
        <h6 className='mb-3'> Please, select the correct account and blockchain on which you want to register via your MetaMask wallet. </h6>
        <h5 className='mb-2 formText'> On chain process: </h5>
        <h6 className='mb-3'> First, you must register your address on the DataCellarRegistry smart contract in the selected blockchain.   </h6>
        <h5 className='mb-2 formText'> Off chain process: </h5>
        <h6 className='mb-3'> Then, you will be issued a verifiable credential that will be saved locally and that you will have to resubmit to prove that you have registered on the smart contract through Data Cellar.  </h6>
        <h5 className='mb-2 formText'> Note: </h5>
        <h6 className='mb-3'> Any additional information you enter during registration will not be saved in any way by Data Cellar, but will only be used to generate your verifiable credential.  </h6>
      </Modal.Body>
      <Modal.Footer className='modalFooterBorder'>
        <Button variant="danger" onClick={() => props.setShowInfoModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignupModal;