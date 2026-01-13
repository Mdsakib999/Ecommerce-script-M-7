# Shopera - MERN E-Commerce Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-web-lightgrey)

A professional, full-stack E-commerce application built with the MERN stack (MongoDB, Express, React, Node.js), featuring robust authentication, product management, and optimized image handling.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
  - [Local Development](#local-development)
  - [Seed & Demo Data](#seed--demo-data)
- [Environment Variables](#environment-variables)
- [Backend API](#backend-api)
- [Frontend Architecture](#frontend-architecture)
- [Image Uploads & Cloudinary](#image-uploads--cloudinary)
- [Error Handling & Best Practices](#error-handling--best-practices)
- [Deployment](#deployment)
- [Testing & Walkthrough](#testing--walkthrough)
- [Troubleshooting](#troubleshooting)
- [Maintenance & Next Steps](#maintenance--next-steps)
- [Contributing](#contributing)
- [License](#license)
- [Appendices](#appendices)

---

## Project Overview

Shopera is designed as a scalable, industry-standard e-commerce solution. It leverages a headless architecture where the React frontend communicates with a RESTful Node.js/Express backend. Key architectural decisions include using **Firebase Authentication** for secure identity management and **Cloudinary** for optimized media delivery.

**High-Level Architecture:**

```
[Client (React/Vite)]
       |
       |  (HTTPS / REST API)
       v
[Load Balancer / Vercel Edge]
       |
       v
[Node.js + Express Server]
    /     \
   /       \
[MongoDB] [Cloudinary]
(Data)    (Images)
   |
[Firebase Auth]
(Identity Verification)
```

---

## Tech Stack

- **Frontend:** React (Context API), TailwindCSS, Vite, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODMs)
- **Authentication:** Firebase Auth (Client SDK + Admin SDK)
- **Media:** Cloudinary (via Multer memory storage)
- **Deployment:** Vercel (Client & Server), MongoDB Atlas

---

## Features

**User Features:**
- 🛍️ **Product Browsing:** Pagination, Search, Filtering (Category, Price, Sort).
- 🛒 **Shopping Cart:** Real-time cart management using React Context.
- 📦 **Checkout:** Streamlined checkout process creating Orders.
- 👤 **User Profile:** Profile management including image upload.
- 🔐 **Authentication:** Secure Sign-up/Login via Google or Email (Firebase).

**Admin Features:**
- 🔧 **Product Management:** Create, Update, Delete products with image uploads.
- 📦 **Order Management:** View orders and mark them as delivered.
- 🚫 **User Management:** Ban/Unban users (server-side sync gate).
- 📊 **Dashboard:** Access to platform metrics (protected by `isAdmin` middleware).

---

## Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Start-Impact/ecommerce-script-mern.git
   cd ecommerce-script-mern
   ```

2. **Install Dependencies:**
   ```bash
   # Backend
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in both `server/` and `client/` directories using the templates in the [Environment Variables](#environment-variables) section.

4. **Run the Application:**

   **Backend (Port 5000):**
   ```bash
   cd server
   npm run dev
   # Server running on http://localhost:5000
   ```

   **Frontend (Port 5173):**
   ```bash
   cd client
   npm run dev
   # Client running on http://localhost:5173
   ```

### Seed & Demo Data

To populate the database with sample products:

1. **Migrate/seed data:**
   Use the seeder script located in `server/utils/seedProducts.js` (if available) or postman.
   
   **Sample JSON for generic product (via Postman):**
   ```json
   {
     "name": "Classic Leather Watch",
     "description": "Premium leather strap watch.",
     "price": 129.99,
     "category": "Accessories",
     "stock": 50,
     "images": [] 
   }
   ```
   *Note: For image uploads, use `multipart/form-data` in Postman.*

---

## Environment Variables

Securely configure your application by setting these variables.

### Backend (`server/.env`)

```env
# Server Configuration
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shopera?retryWrites=true&w=majority

# Firebase Admin SDK (Base64 encoded service account JSON)
# Run `base64 -i service-account.json` to generate this string
FB_SERVICE_KEY=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAg...

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

### Frontend (`client/.env`)

```env
# API URL (Production or Local)
VITE_SERVER_URL=http://localhost:5000

# Firebase Config (Public)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:12345:web:abcdef

# Cloudinary (Optional if using signed uploads from backend only)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
```

---

## Backend API

### Products

**List Products with Pagination & Filters**
- **GET** `/api/products`
- **Query Params:** `page`, `limit`, `keyword`, `category`, `minPrice`, `maxPrice`, `sort`
- **Example:** `/api/products?page=1&limit=10&category=Electronics&sort=price-asc`

**Get Single Product**
- **GET** `/api/products/:id`

**Create Product (Admin)**
- **POST** `/api/products`
- **Auth:** `Authorization: Bearer <ID_TOKEN>`
- **Content-Type:** `multipart/form-data`
- **Body Keys:** `name`, `price`, `description`, `category`, `stock`, `image` (file)

### Orders

**Place Order**
- **POST** `/api/orders`
- **Body:** `{ "orderItems": [...], "shippingAddress": {...}, "paymentMethod": "PayPal" }`

**Get Orders (Admin/User)**
- **GET** `/api/orders` (Users see own orders, Admin sees all)

### Users & Auth

**Get Profile**
- **GET** `/api/users/profile`

**Ban User (Admin)**
- **PUT** `/api/users/:id/ban`
- **Body:** `{ "isBanned": true }`

**Upload Profile Image**
- **POST** `/api/users/profile-image`

---

## Frontend Architecture

- **Search Implementation:**
  - The `SearchBar.jsx` component pushes search terms to the URL query string (`?keyword=...`).
  - `ProductsPage.jsx` listens for URL changes and triggers an API fetch with the new parameters.
  
- **Pagination:**
  - The UI calculates total pages based on the `count` meta-field returned from the API.
  - Clicking a page number updates the URL `page` query param, fetching the next set of results.

- **Cart Management:**
  - Managed via React Context (`CartContext`).
  - Cart state is persisted to `localStorage` to survive page reloads.

---

## Image Uploads & Cloudinary

To ensure Vercel serverless compatibility (which has read-only file systems), we use a **Memory Stream** approach.

1. **Multer Memory Storage:** Files are buffered in RAM, not written to disk.
2. **Stream Upload:** The buffer is converted to a readable stream and piped directly to Cloudinary.

**Key Utilities:**
- `server/middleware/uploadMiddleware.js`: Configures Multer with `storage: multer.memoryStorage()` and 5MB limits.
- `server/utils/uploadFromBuffer.js`: Handles the buffer-to-stream conversion.

```javascript
// Example Usage Pattern
const uploadFromBuffer = require('../utils/uploadFromBuffer');

const createProduct = async (req, res) => {
  if (req.file) {
    const result = await uploadFromBuffer(req.file);
    // Standardize handling: store url and public_id
    req.body.image = result.secure_url; 
    req.body.imagePublicId = result.public_id;
  }
  // ... save to DB
};
```

**Cleanup:**
When updating or deleting products, the backend automatically calls Cloudinary's Destroy API using the stored `imagePublicId` to keep storage clean.

---

## Error Handling & Best Practices

- **Multer Errors:** A global error handling middleware catches `LIMIT_FILE_SIZE` errors and returns a user-friendly 400 Bad Request.
- **Axios Timeout:** The client Axios instance is configured with a **30s timeout** to accommodate slower image uploads on mobile networks.
- **Validation:** 
  - Mongoose models enforce schema validation (e.g., required fields, unique emails).
  - Search inputs are sanitized to prevent injection, though MongoDB text search handles most basic cases safely.
- **Rate Limiting:** Users who are "Banned" are gated at the server level via the `verifyFirebaseToken` + `isBanned` check.

---

## Deployment

### Vercel (Frontend & Backend)

1. **Root Directory:**
   - Configure Vercel to treat `client` as the Frontend root.
   - Configure a separate Vercel project for `server` (or use Vercel Rewrites in a monorepo setup).
2. **Environment Variables:**
   - Add all credentials (CLOUDINARY, MONGO, FIREBASE) to the Vercel Project Settings.
3. **Caveats:**
   - **No Local Filesystem:** Do not use `public/images` for dynamic uploads in production; reliance on Cloudinary is mandatory.

---

## Testing & Walkthrough

**Manual Test Plan:**

1. **Search & Filter:**
   - Go to `/products`. Enter "Phone" in the search bar. Verify URL updates to `?keyword=Phone`.
   - Apply a price filter (e.g., Min 500). Verify results narrow down.
2. **Admin Upload:**
   - Login as Admin. Navigate to **Dashboard > Create Product**.
   - Fill form, attach a 3MB image. Submit.
   - Verify product appears in list and image loads from Cloudinary.
3. **Ban User:**
   - In Admin Panel, find a user -> Click "Ban".
   - Try to login as that user via Incognito window. Should be denied access.

---

## Troubleshooting

- **500 Error on Upload:** 
  - *Cause:* Image likely > 5MB or network timeout.
  - *Fix:* Compress image or check `uploadMiddleware` limits.
  - *Fix:* Ensure Axios timeout is >10000ms.
  
- **Broken Images in Production:**
  - *Cause:* Code might be referencing `localhost` or local `/public` folder.
  - *Fix:* Ensure all dynamic images use the full Cloudinary URL stored in the DB.

- **401/403 Unauthorized:**
  - *Cause:* Firebase Token expired or User is not Admin.
  - *Fix:* Re-login to refresh ID token. Check MongoDB `role` field.

---

## Maintenance & Next Steps

- **Pagination:** Currently offset-based. Consider cursor-based for extremely large datasets.
- **Caching:** Implement Redis for `/api/products` to reduce database load.
- **Rate Limiting:** Add `express-rate-limit` to prevent abuse.

---

## Contributing

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Appendices

### Useful Commands
- `npm run dev`: Runs local server/client.
- `git pull`: Syncs changes.

### Helpful Resources
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
