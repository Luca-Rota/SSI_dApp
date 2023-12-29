import { Button, Modal } from "react-bootstrap";
import "../App.css";

function LogOutModal(props) {

  return (
    <Modal size="sm" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" show={props.showExit} >
      <Modal.Header className='modalHeaderBorder' >
        <Modal.Title className='modalTitle'>Log Out </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBodyBorder'>
        <h6>Are you sure you want to disconnect your member account? </h6>
      </Modal.Body>
      <Modal.Footer className='modalFooterBorder'>
        <Button className='undo' onClick={() => props.setShowExit(false)}>
          Undo
        </Button>
        <Button className='exit' onClick={() => props.handleLoggedOut()}>
          Log Out
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogOutModal;