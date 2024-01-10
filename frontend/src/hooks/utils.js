import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
import { BrowserProvider } from 'ethers';
import { verifyCredential } from 'did-jwt-vc';

export const formatNetwork = (net) => {
  switch (net) {
    case "0x1": return "Ethereum Mainnet";
    case "0xe708": return "Linea Mainnet";
    case "0x5": return "Goerli";
    case "0xaa36a7": return "Sepolia";
    case "0xe704": return "Linea Goerli";
    default: return net;
  }
}

export const getContract = (net) => {
  switch (net) {
    case "0x1": return '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b';
    case "0xe708": return "Linea Mainnet";
    case "0x5": return '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b';
    case "0xaa36a7": return "0x3089fe8DAe3258eef98431BD4efe4a5C8a9d4020";
    case "0xe704": return "0x03d5003bf0e79C5F5223588F347ebA39AfbC3818";
    default: return net;
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function validateName(name) {
  const nameRegex = /^[a-zA-Z ]{2,30}$/;
  return nameRegex.test(name);
}

export function validateSurname(surname) {
  const surnameRegex = /^[a-zA-Z ]{2,30}$/;
  return surnameRegex.test(surname);
}

export function validateProfession(profession) {
  const professionRegex = /^[a-zA-Z_ ]{2,30}$/;
  return professionRegex.test(profession);
}

export const verifyVc = async (vc, chainId) => {
  const providerMetamask = new BrowserProvider(window.ethereum, parseInt(chainId, 16));
  const providerConfig = {
    provider: providerMetamask,
    chainId: chainId,
    registry: getContract(chainId)
  }
  const resolver = new Resolver(getResolver(providerConfig))
  try {
    const verifiedVC = await verifyCredential(vc, resolver);
    return verifiedVC;
  } catch (err) {
    return false;
  }
}