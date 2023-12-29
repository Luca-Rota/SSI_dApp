import { Button, Modal } from "react-bootstrap";
import { useMetaMask } from '../hooks/useMetaMask'
import "../App.css";
import { useNavigate } from "react-router-dom";
import { verifyVc } from '../hooks/utils';

function VcModal(props) {

	const { wallet, opCompleted, setOpCompleted, setErrorMessage } = useMetaMask();

	const navigate = useNavigate();

	const saveToFile = (verifiedVC) => {
		const jwtString = JSON.stringify(verifiedVC, null, 2);
		const blob = new Blob([jwtString], { type: 'application/json' });
		const blobUrl = URL.createObjectURL(blob);
		const downloadLink = document.createElement('a');
		downloadLink.href = blobUrl;
		downloadLink.download = 'DataCellarVC.jwt';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		URL.revokeObjectURL(blobUrl);
		props.setDownloaded(true);
	};

	const handleVC = async () => {
		try {
			const verifiedVC = await verifyVc(props.vc, wallet.chainId);
			if (verifiedVC) {
				saveToFile(verifiedVC.verifiableCredential);
			} else {
				setErrorMessage('Verification of your verifiable credential has failed.');
			}
		} catch (err) {
			setErrorMessage('Something went wrong while verifying your verifiable credential.');
		}
	}

	const closeModalVc = () => {
		props.setVc("");
		props.setDownloaded(false);
		setOpCompleted(false);
		navigate('/');
	}

	return (
		<Modal size="md" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" centered show={opCompleted} >
			<Modal.Header className='modalHeaderBorder'>
				<Modal.Title className='modalTitle'>Sign up process completed successfully</Modal.Title>
			</Modal.Header>
			<Modal.Body className=' modalBodyBorder box-center2'>
				<h6> You are now registered with Data Cellar and this is your Verifiable Credential to prove it.
					Please download and store your VC in a safe place, you will need it to be able to sign in.
				</h6>
				<Button className='mt-3 mb-4 signup-btn' disabled={props.downloaded} onClick={() => handleVC()} > Download VC </Button>
				<h6 className='p-note'> Note: Download your VC now, you will have no other chance to do so, DataCellar does not keep saved user data and VCs. </h6>
			</Modal.Body>
			<Modal.Footer className='modalFooterBorder'>
				<Button disabled={!props.downloaded} className='exit' onClick={() => closeModalVc()}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default VcModal;