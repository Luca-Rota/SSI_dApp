import { Button, Modal } from "react-bootstrap";
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'

function SignupConfirmModal(props) {

  const { isConnecting } = useMetaMask();

  return (
    <Modal size="sm" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" show={props.showRegister} >
      <Modal.Header className='modalHeaderBorder' >
        <Modal.Title className='modalTitle'>Confirm registration </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBodyBorder'>
        <h6>Are you sure you want to register your account? You may have already registered with DataCellar using another blockchain. </h6>
      </Modal.Body>
      <Modal.Footer className='modalFooterBorder'>
        <Button className='exit' onClick={() => props.setShowRegister(false)}>
          Undo
        </Button>
        <Button className='undo' onClick={() => props.handleSignUp()} disabled={isConnecting} >
          {isConnecting ? "Loading" : "Signup"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignupConfirmModal;