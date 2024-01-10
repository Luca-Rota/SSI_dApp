import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { useNavigate } from 'react-router-dom';

const disconnectedState = { accounts: [], chainId: '' }
const MetaMaskContext = createContext({})
const ethers = require("ethers");
const contractAbi = require('../contract/DataCellarRegistryABI');
const contractAddress = "0x201da700B89cdF825314542FEA0d90598F9Ee048";

export const MetaMaskContextProvider = ({ children }) => {

  const navigate = useNavigate();

  const [hasProvider, setHasProvider] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [opCompleted, setOpCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [wallet, setWallet] = useState(disconnectedState)

  const clearError = () => setErrorMessage('')

  const _updateWallet = useCallback(async (providedAccounts) => {
    const accounts = providedAccounts || await window.ethereum.request(
      { method: 'eth_accounts' },
    )
    if (accounts.length === 0) {
      setWallet(disconnectedState)
      return
    }
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    })
    setWallet({ accounts, chainId })
  }, [])

  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [_updateWallet])
  const updateWallet = useCallback((accounts) => _updateWallet(accounts), [_updateWallet])

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ mustBeMetaMask: true, silent: true })
      setHasProvider(provider)
      if (provider) {
        updateWalletAndAccounts()
        window.ethereum.on('accountsChanged', updateWallet)
        window.ethereum.on('chainChanged', updateWalletAndAccounts)
      }
    }
    getProvider()
    return () => {
      window.ethereum?.removeListener('accountsChanged', updateWallet)
      window.ethereum?.removeListener('chainChanged', updateWalletAndAccounts)
    }
  }, [updateWallet, updateWalletAndAccounts])

  useEffect(() => {
    if (wallet.accounts.length === 0 || !window.ethereum?.isConnected) {
      navigate('/');
    }
  }, [wallet.accounts, navigate, errorMessage]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      clearError();
    }, 10000)

    return () => {
      clearTimeout(timeId)
    }
  }, [errorMessage]);

  const timeoutPromise = (timeout) => new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeout)
  );

  const connectMetaMask = async () => {
    setIsConnecting(true)
    if (!window.ethereum?.isConnected) {
      setErrorMessage("Please, use the MetaMask wallet to connect. Remove other wallets from your browser extensions.");
      setTimeout(() => window.location.reload(), 10000);
    } else {
      try {
        window.location.reload();
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        clearError()
        updateWallet(accounts)
      } catch (err) {
        setErrorMessage(err.message)
      }
    }
    setIsConnecting(false)
  }

  const isRegistered = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum, parseInt(wallet.chainId, 16));
      const signerPromise = provider.getSigner(wallet.accounts[0]);
      const signer = await Promise.race([signerPromise, timeoutPromise(10000)]);
      if (!signer) {
        throw new Error('Timeout');
      }
      const dataCellarRegistry = new ethers.Contract(contractAddress, contractAbi, signer);
      const isUserRegistered = await dataCellarRegistry.isUserRegistered(wallet.accounts[0]);
      return isUserRegistered;
    } catch (err) {
      if (err.message === 'Timeout') {
        window.location.reload();
      } else {
        setErrorMessage(`Failure to contact DataCellar's smart contract: ${err.message}`);
      }
    }
  };

  const signupDataCellar = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum, parseInt(wallet.chainId, 16));
      const signerPromise = provider.getSigner(wallet.accounts[0]);
      const signer = await Promise.race([signerPromise, timeoutPromise(10000)]);
      if (!signer) {
        throw new Error('Timeout');
      }
      const dataCellarRegistry = new ethers.Contract(contractAddress, contractAbi, signer);
      const registeredCheck = await isRegistered();
      if (!registeredCheck) {
        const tx = await dataCellarRegistry.registerUser(wallet.accounts[0]);
        await tx.wait(1);
        clearError();
        return true;
      } else {
        setErrorMessage('The selected account is already registered in Data Cellar on this network.');
        return false;
      }
    } catch (err) {
      if (err.message === 'Timeout') {
        window.location.reload();
      } else {
        setErrorMessage(`The sign up operation on DataCellar's smart contract failed.`);
        return false;
      }
    }
  }

  function generateRandomNonce() {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    const nonce = Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    return nonce;
  }

  const signJWT = async () => {
    const nonce = generateRandomNonce();
    const message = `I am signing a one-time nonce: ${nonce}`;
    try {
      const signature = await window.ethereum.request({
        "method": "personal_sign",
        "params": [
          message,
          wallet.accounts[0]
        ]
      });
      clearError();
      return { signature: signature, nonce: nonce };
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  const unregisterDataCellar = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum, parseInt(wallet.chainId, 16));
      const signerPromise = provider.getSigner(wallet.accounts[0]);
      const signer = await Promise.race([signerPromise, timeoutPromise(10000)]);
      if (!signer) {
        throw new Error('Timeout');
      }
      const dataCellarRegistry = new ethers.Contract(contractAddress, contractAbi, signer);
      const registeredCheck = await isRegistered();
      if (registeredCheck) {
        const tx = await dataCellarRegistry.unregisterUser(wallet.accounts[0]);
        await tx.wait(1);
        clearError();
        return true;
      } else {
        setErrorMessage('The selected account is not registered in Data Cellar on this network.');
        return false;
      }
    } catch (err) {
      if (err.message === 'Timeout') {
        window.location.reload();
      } else {
        setErrorMessage(`The deregistration on DataCellar's smart contract failed.`);
        return false;
      }
    }
  }

  return (
    <MetaMaskContext.Provider
      value={{
        wallet,
        hasProvider,
        error: !!errorMessage,
        errorMessage,
        isConnecting,
        connectMetaMask,
        clearError,
        signupDataCellar,
        opCompleted,
        setOpCompleted,
        signJWT,
        setIsConnecting,
        setErrorMessage,
        isRegistered,
        unregisterDataCellar,
        setWallet
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  )
}

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext)
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a "MetaMaskContextProvider"')
  }
  return context
}