import { Modal, Button } from "react-bootstrap";

function SigninModal(props) {

  return (
    <Modal size="md" className="vc-modal" show={props.showInfoModal}>
      <Modal.Header className='modalHeaderBorder'>
        <Modal.Title className='modalTitle'> Useful information for Sign In </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBodyBorder overflow-auto'>
        <h6 className='mb-3'> Complete the sign in as member in Data Cellar. </h6>
        <h5 className='mb-2 formText'> Prerequisites: </h5>
        <h6 className='mb-3'> You must be registered on Data Cellar's smart contract and have obtained Data Cellar's verifiable credential. </h6>
        <h5 className='mb-2 formText'> The process: </h5>
        <h6 className='mb-3'> The system verify that the verifiable credential you provide is valid, that is, it is owned by you and issued by DataCellar. If so, you will be made to sign a JWT that will be placed in the session cookie.    </h6>
        <h5 className='mb-2 formText'> What can you do next: </h5>
        <h6 className='mb-3'> As a member you can visit the entire Data Cellar site and perform all the transactions and APIs you are allowed based on the JWT saved in your session cookie.   </h6>
        <h5 className='mb-2 formText'> Note: </h5>
        <h6 className='mb-3'> The verifiable credential you provide will not be saved in any way by Data Cellar, but only used to generate the JWT to be placed in your session cookie.  </h6>
      </Modal.Body>
      <Modal.Footer className='modalFooterBorder'>
        <Button variant="danger" onClick={() => props.setShowInfoModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SigninModal;