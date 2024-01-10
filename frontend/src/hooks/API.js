async function handleAuthenticate(signature, publicAddress, nonce, credentials) {
  let response = await fetch(new URL('https://localhost:3001/api/auth'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ signature, publicAddress, nonce, credentials }),
    credentials: 'include'
  });
  return await response.json();
}

async function createVC(credentials, publicAddress, chainId) {
  let response = await fetch(new URL('https://localhost:3001/api/vc'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credentials, publicAddress, chainId }),
    credentials: 'include'
  });
  return await response.json();
}

const API = { handleAuthenticate, createVC }

export default API;