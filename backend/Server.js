const eth_utils = require('ethereumjs-util');
const eth_sign_utils = require('eth-sig-util');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');
const ethr_did = require('ethr-did');
const did_jwt_vc = require('did-jwt-vc');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const jwtConfig = {
  algorithms: ['HS256'],
  secret: process.env.JWT_SECRET
};

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const corsOptions = {
  origin: 'https://localhost:3000',
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.post('/api/auth', function (req, res, next) {
  const { signature, publicAddress, nonce, credentials } = req.body;

  if (!signature || !publicAddress || !nonce || !credentials) {
    return res.status(400).send({ error: 'Request should have signature, publicAddress, nonce, country and region.' });
  }

  const msg = `I am signing a one-time nonce: ${nonce}`;
  const msgBufferHex = eth_utils.bufferToHex(Buffer.from(msg, 'utf8'));
  const address = eth_sign_utils.recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  if (address.toLowerCase() === publicAddress.toLowerCase()) {
    jwt.sign(
      {
        payload: {
          publicAddress: publicAddress,
          name: credentials.name,
          surname: credentials.surname, 
          email: credentials.email,
          profession: credentials.profession,
          country: credentials.country,
          region: credentials.region
        },
      },
      jwtConfig.secret,
      {
        algorithm: jwtConfig.algorithms[0],
      },
      (err, accessToken) => {
        if (err) {
          return next(err);
        }
        if (!accessToken) {
          return next(new Error('Empty token.'));
        }
        res.json({ accessToken });
      }
    );
  } else {
    res.status(401).send({ error: 'Signature verification failed.' });
  }
});

app.post('/api/vc', async function (req, res) {

  try {
    const { credentials, publicAddress, chainId } = req.body;

    if (!credentials || !publicAddress || !chainId) {
      return res.status(400).send({ error: 'Request should have credentials, publicAddress and chainId.' });
    }

    const issuer = new ethr_did.EthrDID({
      identifier: process.env.OWNER_ADDRESS,
      privateKey: process.env.PRIVATE_KEY,
      alg: "ES256K-R",
      chainNameOrId: chainId
    });

    const holder = new ethr_did.EthrDID({
      identifier: publicAddress,
      alg: "ES256K-R",
      chainNameOrId: chainId
    });

    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);

    const vcPayload = {
      sub: holder.did,
      nbf: timestamp,
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
          name: credentials.name,
          surname: credentials.surname,
          email: credentials.email,
          profession: credentials.profession,
          country: credentials.selectedCountry,
          region: credentials.selectedRegion
        }
      }
    }

    const vcJwt = await did_jwt_vc.createVerifiableCredentialJwt(vcPayload, issuer);
    res.json(vcJwt);

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Verifiable Credential creation failed.' });
  }
});

https.createServer(options, app).listen(port, () =>
  console.log(`Express app listening on localhost:${port}`)
);