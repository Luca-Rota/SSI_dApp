import React, { useEffect, useState } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./components/Login.js"
import Home from "./components/Home.js"
import Signup from "./components/Signup.js"
import Signin from "./components/Signin.js"
import LogOutModal from "./components/LogOutModal.js"
import { Container, Alert } from "react-bootstrap";
import MyNavbar from './components/Navbar';
import { MetaMaskContextProvider, useMetaMask } from './hooks/useMetaMask'
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <MetaMaskContextProvider>
        <App2 />
      </MetaMaskContextProvider>
    </Router>
  );
}

function App2() {

  const navigate = useNavigate();

  const [showExit, setShowExit] = useState(false);
  const [vc, setVc] = useState("");
  
  const { wallet, error, errorMessage, clearError, setOpCompleted } = useMetaMask();

  /* useEffect(() => {
     const timeId = setTimeout(() => {
       clearError();
     }, 10000)
 
     return () => {
       clearTimeout(timeId)
     }
   }, [showErr, errorMessage]);
 */

  const [authState, setAuthState] = useState();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    if (authTokenCookie) {
      const authToken = authTokenCookie.split('=')[1];
      const { payload: { publicAddress, country, region } } = jwtDecode(authToken);
      setAuthState({ publicAddress, country, region });
      console.log(authState)
    }
  }, []);

  const handleLoggedIn = (auth, publicAddress, country, region) => {
    document.cookie = `authToken=${JSON.stringify(auth)}; path=/; samesite=None; secure`;
    setAuthState({ publicAddress, country, region });
    navigate('/');
  };

  const handleLoggedOut = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setAuthState(undefined);
    setShowExit(false);
    navigate('/');
  };

  const handleVcCreation = (vcCreated) => {
    setVc(vcCreated);
    setOpCompleted(true);
  }

  function Layout() {
    return (
      <>
        <MyNavbar setShowExit={setShowExit} authState={authState} />
        <Container className="box-center" >
          {error &&
            <Alert variant="danger" className="err-alert" onClose={clearError} dismissible >
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p> { errorMessage } </p>
            </Alert>
          }
          <LogOutModal showExit={showExit} setShowExit={setShowExit} handleLoggedOut={handleLoggedOut} />
          <Outlet />
        </Container>
      </>
    );
  }

  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={(wallet.accounts.length > 0 && window.ethereum?.isConnected) ? <Home /> :
          <Login />} />
        <Route path="signin" element={<Signin handleLoggedIn={handleLoggedIn} />} />
        <Route path="signup" element={<Signup handleVcCreation={handleVcCreation} vc={vc} setVc={setVc} />} />
      </Route>
    </Routes>

  );
}

export default App;