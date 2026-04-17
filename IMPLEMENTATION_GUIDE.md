# Early Support DApp - Complete Implementation Guide

A blockchain-based content support platform built with Solidity, React, and Spring Boot.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Blockchain Setup (Ganache)](#blockchain-setup-ganache)
4. [Smart Contract Deployment](#smart-contract-deployment)
5. [Backend Setup (Spring Boot)](#backend-setup-spring-boot)
6. [Frontend Setup (React)](#frontend-setup-react)
7. [Configuration](#configuration)
8. [Running the Application](#running-the-application)
9. [Testing Multi-User Scenarios](#testing-multi-user-scenarios)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Java 17+** - [Download](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- **Maven 3.8.8+** - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/)
- **MetaMask** browser extension - [Install](https://metamask.io/)

Verify installations:
```bash
node --version
java -version
mvn --version
```

---

## Project Setup

### Step 1: Clone or Navigate to Project Directory

```bash
cd "C:\Users\BHARGAV\OneDrive\Desktop\BC LAB\Block-Chain-mini"
```

### Step 2: Install Global Dependencies

```bash
npm install -g ganache-cli
npm install -g truffle
```

### Step 3: Verify Project Structure

Your project should have this structure:
```
Block-Chain-mini/
├── contracts/
│   └── EarlySupport.sol
├── migrations/
│   └── 2_deploy_contracts.js
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── config.js
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── vite.config.js
├── backend/
│   ├── pom.xml
│   └── src/
├── truffle-config.js
└── package.json
```

---

## Blockchain Setup (Ganache)

### Step 1: Start Ganache Local Blockchain

Open a **PowerShell/Command Prompt** and run:

```bash
ganache-cli --host 127.0.0.1 --port 7545 --deterministic
```

**Expected Output:**
```
ganache v7.x.x or higher
listening on 127.0.0.1:7545
...
Account 0: 0x90F8... (~100 ETH)
Account 1: 0xFFcf... (~100 ETH)
... (10 accounts total)
Mnemonic: myth like bonus scare over problem client lizard pioneer submit female collect
```

**Keep this terminal running** - it's your blockchain.

---

## Smart Contract Deployment

### Step 2: Compile and Deploy Contract

Open a **new PowerShell/Command Prompt**:

```bash
cd "C:\Users\BHARGAV\OneDrive\Desktop\BC LAB\Block-Chain-mini"
```

Compile the contract:
```bash
truffle compile
```

**Expected Output:**
```
Compiling your contracts...
> Compiling .\contracts\EarlySupport.sol
> Artifacts written to .\build\contracts
> Compilation complete
```

Deploy the contract:
```bash
truffle migrate --network development
```

**Expected Output:**
```
Starting migrations...
...
2_deploy_contracts.js
   Deploying 'EarlySupport'
   > transaction hash: 0x...
   > contract address: 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
   > block number: 1
   
2 migrations completed successfully
```

⚠️ **IMPORTANT:** Note the **contract address** (example: `0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab`). You'll need this later.

---

## Backend Setup (Spring Boot)

### Step 3: Install Backend Dependencies

Open a **new PowerShell/Command Prompt**:

```bash
cd "C:\Users\BHARGAV\OneDrive\Desktop\BC LAB\Block-Chain-mini\backend"
```

Install Maven dependencies:
```bash
mvn clean install
```

This may take 2-5 minutes on first run. **Wait for it to complete.**

**Expected Output:**
```
[INFO] BUILD SUCCESS
```

### Step 4: Start Backend Server

Still in the `backend` directory:

```bash
mvn spring-boot:run
```

**Expected Output:**
```
Started EarlySupportApplication in X.XXX seconds
Tomcat started on port(s): 8080
```

**Keep this terminal running** - your backend is now live at `http://localhost:8080`

---

## Frontend Setup (React)

### Step 5: Install Frontend Dependencies

Open a **new PowerShell/Command Prompt**:

```bash
cd "C:\Users\BHARGAV\OneDrive\Desktop\BC LAB\Block-Chain-mini\frontend"
```

Install npm packages:
```bash
npm install
```

**Expected Output:**
```
added XXX packages in X.XXXs
```

---

## Configuration

### Step 6: Update Contract Address in Frontend

Edit: `frontend/src/config.js`

Replace the placeholder with your actual contract address:

```javascript
export const CONFIG = {
  CONTRACT_ADDRESS: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",  // ← Use YOUR deployed address
  ABI: EarlySupportABI.abi
};
```

### Step 7: Configure MetaMask

1. **Open MetaMask** extension
2. **Click** on the network dropdown (usually shows "Ethereum Mainnet")
3. **Click** "Add Network"
4. **Fill in:**
   - Network Name: `Ganache`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
5. **Click** "Save"

### Step 8: Import Test Accounts into MetaMask

Using the Ganache mnemonic, import test accounts:

1. **In MetaMask**, click the account icon (top right)
2. **Click** "Import Account"
3. **Paste** a private key from Ganache:
   - Account 0: `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113d26f0d67030b0efa01171647`
   - Account 1: `0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1`
   - Account 2: `0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c`
   - Account 3: `0x646f1ce2fdad0e6deeaead50dad78fe8776aa4e8d60344c2e2f62e7799c99fbf`
   - Account 4: `0xadd53f9a7e588d003326d8957dffb9d893e1dc5ad0b15e6f4aab32529271e48e`

4. **Repeat** for each account

---

## Running the Application

### Step 9: Start Frontend Development Server

In the `frontend` directory (where npm install was run):

```bash
npm run dev
```

**Expected Output:**
```
VITE v4.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 10: Access the Application

1. **Open browser** and go to: `http://localhost:5173`
2. You should see the **Login/Register page**

---

## Testing Multi-User Scenarios

### Complete User Flow:

#### **Test 1: Creator Account**

1. Go to `http://localhost:5173`
2. **Register** with:
   - Email: `creator@support.com`
   - Password: `password123`
   - Role: `Creator`
3. **Sign in** with the same credentials
4. **Connect Wallet** (Account 0 in MetaMask)
5. **Launch New Content**:
   - Title: "My Awesome Blockchain Tutorial"
   - Description: "Learn blockchain basics"
6. **Verify** content appears on dashboard with "ACTIVE" badge

#### **Test 2: First Supporter Account**

1. **Logout** from creator account
2. **Register** new account with:
   - Email: `supporter1@support.com`
   - Password: `password123`
   - Role: `Supporter`
3. **Switch MetaMask** to Account 1
4. **Connect Wallet**
5. **View Dashboard** - should see creator's content
6. **Click "Support Content"** button
7. **Confirm transaction** in MetaMask popup
8. **Verify** toast shows "Support transaction successful"

#### **Test 3: Second Supporter Account**

1. **Logout** from supporter account
2. **Register** new account with:
   - Email: `supporter2@support.com`
   - Password: `password123`
   - Role: `Supporter`
3. **Switch MetaMask** to Account 2
4. **Connect Wallet**
5. **View Dashboard** - content shows 1/20 supporters
6. **Support Content** - should work
7. **Verify** supporter count increases

#### **Test 4: Add 18 More Supporters (Reaching Limit)**

Repeat Test 3 process 18 more times with:
- Different email accounts
- Different MetaMask accounts (Account 3-9, repeat as needed)
- Each should successfully support content

**After 20 supporters:**
- Support button will be disabled
- Toast shows "Support limit reached"

#### **Test 5: Mark Viral**

1. **Switch back to creator account**
2. **Switch MetaMask to Account 0**
3. **Connect Wallet** on Creator Dashboard
4. **View content** - should have "Mark Viral" button
5. **Click "Mark Viral"**
6. **Confirm** transaction in MetaMask
7. **Verify** content now shows "VIRAL" badge
8. **All supporters get 0.01 ETH reward**

---

## Command Reference

### Quick Start (All Services)

**Terminal 1 - Blockchain:**
```bash
ganache-cli --host 127.0.0.1 --port 7545 --deterministic
```

**Terminal 2 - Smart Contracts:**
```bash
cd "C:\Users\BHARGAV\OneDrive\Desktop\BC LAB\Block-Chain-mini"
truffle compile
truffle migrate --network development
```

**Terminal 3 - Backend:**
```bash
cd "C:\Users\BHARGAV\OneDrive\Desktop\BC LAB\Block-Chain-mini\backend"
mvn spring-boot:run
```

**Terminal 4 - Frontend:**
```bash
cd "C:\Users\BHARGAV\OneDrive\Desktop\BC LAB\Block-Chain-mini\frontend"
npm run dev
```

---

## Troubleshooting

### Issue: "ganache-cli: command not found"
**Solution:**
```bash
npm install -g ganache-cli
```

### Issue: "Port 7545 already in use"
**Solution:**
```bash
# Kill process on port 7545
netstat -ano | findstr :7545
taskkill /PID <PID> /F
# Then restart ganache-cli
```

### Issue: "Error: contract address not configured"
**Solution:**
1. Copy the deployed contract address from `truffle migrate` output
2. Update `frontend/src/config.js` with the correct address
3. Refresh the browser

### Issue: "eth_requestAccounts already pending"
**Solution:**
1. Close the browser tab completely
2. Open a new tab
3. Go to `http://localhost:5173`
4. Try connecting wallet again

### Issue: "Maven command not found"
**Solution:**
```bash
# Download Maven from https://maven.apache.org/download.cgi
# Extract to C:\Program Files\maven
# Add to PATH: C:\Program Files\maven\bin
# Restart PowerShell/CMD
```

### Issue: "MetaMask account not switching"
**Solution:**
1. **Logout** from app
2. **Switch account in MetaMask**
3. **Refresh page** (Ctrl+R)
4. **Register/Sign in** again
5. **Connect Wallet**

### Issue: "Backend returning 404 errors"
**Solution:**
1. Ensure backend is running on port 8080
2. Check CORS configuration in `AuthController.java`
3. Verify frontend is calling correct URL: `http://localhost:8080/api/auth/...`

### Issue: "Content not showing on supporter dashboard"
**Solution:**
1. Ensure creator account successfully registered content
2. Ensure supporter account is connected with different MetaMask account
3. Check browser console for errors (F12 → Console)
4. Verify contract address in `config.js`

---

## Technology Stack

- **Blockchain:** Solidity ^0.8.19, Ganache, Truffle
- **Frontend:** React 18, Vite, ethers.js v6, Tailwind CSS, React Router v6
- **Backend:** Spring Boot 3.2, Spring Data JPA, H2 Database
- **Authentication:** JWT (Email/Password)
- **Web3:** MetaMask, Web3 RPC calls

---

## Smart Contract Details

### Contract: EarlySupport

**Constants:**
- `SUPPORT_AMOUNT`: 0.01 ETH per support
- `MAX_SUPPORTERS`: 20 supporters per content

**Key Functions:**
- `registerContent(title, descriptionHash)` - Creator registers new content
- `support(contentId)` - Supporter funds content
- `markViral(contentId)` - Creator marks content as viral after reaching 20 supporters
- `getSupporters(contentId)` - Get all supporters of content
- `getPoolBalance(contentId)` - Get total pool for content

---

## Backend API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

**Request/Response:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "creator" or "supporter"
}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "role": "creator"
}
```

---

## Support

For issues or questions, check:
1. Browser Console (F12 → Console tab)
2. Backend logs (Terminal where `mvn spring-boot:run` is running)
3. Ganache logs (Terminal where `ganache-cli` is running)

---

## License

MIT License - Free to use and modify

---

**Last Updated:** April 2026
**Version:** 1.0
