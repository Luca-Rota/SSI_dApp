import { Button, Modal } from "react-bootstrap";
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'

function DeleteUserModal(props) {

  const { unregisterDataCellar, setIsConnecting, setErrorMessage, isConnecting, wallet } = useMetaMask();

  const handleDelete = async () => {
    setIsConnecting(true);
    try {
      const chainId = wallet.chainId;
      if (chainId === "0x5" || chainId === "0xaa36a7") {
        const res = await unregisterDataCellar();
        if (res) {
          props.handleLoggedOut();
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
    <Modal size="sm" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" show={props.showDelete} >
      <Modal.Header className='modalHeaderBorder' >
        <Modal.Title className='modalTitle'>Confirm deregistration </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBodyBorder'>
        <h6>Are you sure you want to delete your account? You will have to pay fees to deregister your address from the DataCellarRegistry smart contract. </h6>
      </Modal.Body>
      <Modal.Footer className='modalFooterBorder'>
        <Button className='undo' onClick={() => props.setShowDelete(false)}>
          Undo
        </Button>
        <Button className='exit' onClick={() => handleDelete()} disabled={isConnecting} >
          {isConnecting ? "Loading" : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteUserModal;