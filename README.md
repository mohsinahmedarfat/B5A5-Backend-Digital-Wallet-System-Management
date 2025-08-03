# 💸 Digital Wallet System Management API

A RESTful API built using **Node.js**, **Express**, **TypeScript**, and **MongoDB** to manage a secure digital wallet platform. This system allows users to register, manage wallets, perform transactions (top-up, withdraw, send), and provides admin functionalities to control wallet statuses.

---

## 🧠 Project Overview

This project simulates the backend of a digital wallet system with the following core features:

- **User Authentication** (register, login)
- **Role-based Access Control** (`USER`, `AGENT`, `ADMIN`, `SUPER_ADMIN`)
- **Wallet Management** (auto-created on registration)
- **Transactions**:
  - Top-Up
  - Withdraw
  - Send to another user
- **Admin Control**:
  - Block/unblock wallets
  - View all wallets and transactions
- **Validation** using `zod`
- **Authorization Middleware** using JWT

---

## ⚙️ Setup & Environment Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/digital-wallet-api.git
cd digital-wallet-api
```
### 2. Install dependencies
```bash
npm install
```
### 3. Setup environment variables
Create a .env file in the root folder and configure the following:
```bash
PORT=5000
DB_URL=mongodb://localhost:27017/digital-wallet
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=30d

# BCRYPT
BCRYPT_SALT_ROUND=10

# SUPER ADMIN
SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_PASSWORD=super_admin_password

# Google Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Express Session
EXPRESS_SESSION_SECRET=your_express-session
```
### 4. repository
```bash
npm run dev
```
Your server should now be running on http://localhost:5000

## 📫 API Endpoints Summary
All endpoints are prefixed with: /api/v1

### 🧍 User Routes

| Method | Endpoint         | Access        | Description             |
| ------ | ---------------- | ------------- | ----------------------- |
| POST   | `/user/register` | Public        | Register a new user     |
| GET    | `/user/all-users`          | Admin Only    | Get all users           |
| PATCH  | `/user/:id`      | Authenticated | Update user information |

### 🔐 Auth Routes

| Method | Endpoint      | Access | Description      |
| ------ | ------------- | ------ | ---------------- |
| POST   | `/auth/login` | Public | User login (JWT) |
| POST   | `/auth/refresh-token` | Public        | Get a refresh token      |
| POST    | `/auth/logout`          | Public    | User logout           |
| get  | `/auth/google`      | Public | User google login |
| get  | `/auth/google/callback`      | Public | Callback after google login |

### 💳 Wallet Routes

| Method | Endpoint                   | Access            | Description                           |
| ------ | -------------------------- | ----------------- | ------------------------------------- |
| GET    | `/wallet`                  | Admin Only        | Get all wallets                       |
| PATCH  | `/wallet/top-up/:userId`   | Authenticated     | Top-up wallet by user or agent        |
| PATCH  | `/wallet/withdraw/:userId` | Authenticated     | Withdraw from wallet by user or agent |
| PATCH  | `/wallet/send/:receiverId` | Authenticated     | Send money from one wallet to another |
| PATCH  | `/wallet/status/:userId`   | Admin/Super Admin | Block or unblock a user’s wallet      |

### 🔁 Transaction Routes

| Method | Endpoint          | Access        | Description                |
| ------ | ----------------- | ------------- | -------------------------- |
| GET    | `/transaction`    | Admin Only    | Get all transactions       |

## 🔐 Roles & Permissions

| Role          | Abilities                                            |
| ------------- | ---------------------------------------------------- |
| `USER`        | Top-up, withdraw, send to others                     |
| `AGENT`       | Same as user + top-up/withdraw for others            |
| `ADMIN`       | View all users/wallets/transactions, manage statuses |
| `SUPER_ADMIN` | Full access to all admin capabilities                |

## 🏁 Technologies Used

- Node.js, Express
- MongoDB, Mongoose
- TypeScript
- Zod (validation)
- JWT for Authentication
- Passport.js for session handling (optional) 
- bcrypt for password hashing

## 📁 Folder Structure

```bash
src/
  └── app/
      ├── modules/
      │   ├── user/
      │   ├── auth/
      │   ├── wallet/
      │   └── transaction/
      ├── middlewares/
      ├── config/
      ├── routes/
      └── utils/
```

## 🧪 Future Improvements

- Add email verification (OTP-based)
- Build frontend dashboard for users and admin
- Add transaction filters (by date, amount, type)
- Integrate third-party payment gateway (e.g., Stripe)
- Export wallet or transaction data as CSV or PDF






