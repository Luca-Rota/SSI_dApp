# SSI_dApp

<p align="center">
This is a decentralized application useful for managing users' digital identity following the Self Sovereign Identity (SSI) method. Specifically, it is a stand-alone, so it can work independently, but it is designed to be integrated with the Data Cellar project. 
</p>

## Getting Started

### Installing mkcert

#### Linux
```bash
sudo apt-get install libnss3-tools
```

#### MacOS
```bash
brew install mkcert
```

#### Windows
```bash
choco install mkcert
```

### Creating Certificates for the Backend
```bash
cd backend
mkcert -key-file key.pem -cert-file cert.pem localhost
cd ..
```

### Installing OpenSSL

#### Linux
```bash
sudo apt-get install openssl
```

#### MacOS
```bash
brew install openssl
```

#### Windows
```bash
choco install openssl
```

### Creating Certificates for the Frontend

```bash
cd frontend
mkcert -key-file key.pem -cert-file cert.pem localhost
openssl x509 -in cert.pem -out cert.crt
openssl rsa -in key.pem -out key.key
cd ..
```

### Installing dependencies

```bash
cd frontend
npm install
cd ..
cd backend
npm install
```

## Running

Open two terminals: one for the frontend and one for the backend.

### Starting the Frontend

```bash
cd frontend
npm start
```

### Starting the Backend

```bash
cd backend
node server.js
```


## License

This project is distributed under the [MIT license](./LICENSE). Please read the [LICENSE](./LICENSE) file for details.
