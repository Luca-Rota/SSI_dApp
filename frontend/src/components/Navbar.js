import { Button, Navbar, Nav, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import { default as Logo } from "../assets/logo.jpg";
import { default as User } from '../assets/user.svg';
import { default as Exit } from '../assets/exit.svg';
import { default as Visitor } from '../assets/visitor.svg';
import "../App.css";
import { default as Network } from '../assets/network.svg';
import React from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { formatNetwork } from '../hooks/utils';
import { useNavigate } from "react-router-dom";

function MyNavbar(props) {

  const { wallet } = useMetaMask()

  const navigate = useNavigate();

  const formatAddress = (addr) => {
    const firstFive = addr.substring(0, 7);
    const lastFive = addr.substring(addr.length - 5);
    return `${firstFive}...${lastFive}`;
  }

  const renderTooltip1 = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      Visitor account.
    </Tooltip>
  );

  const renderTooltip2 = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      Blockchain selected.
    </Tooltip>
  );

  const renderTooltip4 = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      Log Out.
    </Tooltip>
  );

  return (
    <Navbar collapseOnSelect expand="lg" fixed="top" className="nav">
      <Container fluid >
        <Navbar.Brand type="button" onClick={() => navigate('/')}>
          <img src={Logo} className="logo-nav me-4" alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="px-3">
          {(wallet.accounts.length < 1 || props.authState || (wallet.accounts.length > 0 && !window.ethereum?.isConnected)) ?
            <Nav className="me-auto"> </Nav> :
            <Nav className="me-auto">
              <Button className="nav-btn me-4" onClick={() => navigate('/signup')}> Sign up </Button>
              <Button className="nav-btn me-4" onClick={() => navigate('/signin')}> Sign in </Button>
            </Nav>}

          <Nav>
            {(window.ethereum?.isConnected && wallet.accounts.length > 0 && !props.authState) ?
              <Nav>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip1} >
                  <Button className="nav-box me-4">
                    <img src={Visitor} alt="visitor" /> <h6 className="h6-info ms-2"> {formatAddress(wallet.accounts[0])} </h6>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip2} >
                  <Button className="nav-box me-3 ">
                    <img src={Network} alt="network" /><h6 className="h6-info ms-3">  {formatNetwork(wallet.chainId)} </h6>
                  </Button>
                </OverlayTrigger>
              </Nav> :
              (props.authState && window.ethereum?.isConnected) ?
                <Nav className="box-center">
                  <Button className="nav-box3 me-2" onClick={() => navigate('/profile')}>
                    <img src={User} alt="user" /> <h6 className="h6-info ms-2"> Visit Your Profile </h6>
                  </Button>
                  <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip4} >
                    <Button className="nav-exit me-4 mt-1 " onClick={() => props.setShowExit(true)}>
                      <img src={Exit} alt="exit" />
                    </Button>
                  </OverlayTrigger>
                </Nav> : <Nav />
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;