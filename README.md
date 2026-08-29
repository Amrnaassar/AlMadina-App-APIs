# 🛒 Al Madina Supermarket — E-Commerce Backend

A **RESTful e-commerce backend** built for a supermarket mobile commerce platform, powering dedicated **Customer** and **Admin Flutter applications**.

The platform supports product browsing, offers, favorites, cart and order workflows, user authentication, location services, and Firebase push notifications.

> **Note:** The original Flutter mobile application source code is no longer maintained in this repository. This repository contains the **Node.js REST API** that powered the Customer and Admin mobile applications.

---

## 📌 Project Overview

Al Madina Supermarket is a full-stack mobile e-commerce platform designed to provide customers with a convenient way to browse products, manage their cart, place orders, and track their order history.

A dedicated **Admin application** was also developed to manage products, categories, advertisements, and customer orders.

The backend was built with **Node.js, Express, MongoDB, and JWT**, with integrations for **Firebase Cloud Messaging** and **Google Maps / location services**.

---

## ✨ Key Features

### 👤 Customer Application

* User registration and login
* JWT-based authentication
* OTP verification
* Password recovery
* User profile management
* Product browsing
* Category browsing
* Product search
* Promotional advertisements
* Favorites / wishlist
* Cart management
* Order placement
* Order history
* Order details
* Delivery address and phone information
* Customer location handling

### 🛠️ Admin Application

The project included a dedicated Flutter-based administration application for managing the supermarket platform.

* Product management

  * Create products
  * Update products
  * Delete products
  * View products
* Category management
* Advertisement management
* Order management
* Order status updates
* Customer order monitoring
* Push notification management

---

## 🔐 Authentication & Security

The backend implements JWT-based authentication using a custom authentication middleware.

### Authentication capabilities

* User registration
* Login
* JWT token generation
* Protected API endpoints
* OTP verification
* Password reset
* Authenticated user profile access
* User role support (`user` / `admin`)
* Password hashing using `bcrypt`

Protected endpoints extract the authenticated user's ID from the JWT token and use it throughout the request workflow.

---

## 🛍️ Product Management

The product API provides complete CRUD functionality for the supermarket catalog.

### Product capabilities

* Create product
* Retrieve all products
* Retrieve product by ID
* Search products
* Filter products by category
* Update product
* Delete product
* Stock management
* Discount support
* Product images
* Category relationships

---

## 📂 Category Management

Categories can be fully managed through the REST API.

* Create category
* Retrieve categories
* Retrieve category by ID
* Update category
* Delete category

Each category contains information such as:

* Name
* Description
* Image
* Creation date

---

## 🎯 Advertisements & Offers

The platform includes an advertisement system for promoting products inside the mobile application.

Administrators can:

* Create advertisements
* View advertisements
* Update advertisements
* Delete advertisements
* Associate advertisements with products

This supported the promotional content displayed in the customer application.

---

## 🛒 Cart & Order Workflow

The platform implements a complete customer ordering workflow.

### Order flow

```text
Browse Products
      ↓
Select Product
      ↓
Add to Cart
      ↓
Review Cart
      ↓
Enter Delivery Details
      ↓
Submit Order
      ↓
Order Created
      ↓
Admin Notification
      ↓
Admin Reviews Order
      ↓
Order Status Updated
```

### Order management includes

* Order creation
* Customer order history
* Order details
* Product quantities
* Total price
* Delivery address
* Customer phone number
* Order status
* Administrative order management

Supported order statuses include:

* `pending`
* `completed`
* `cancelled`

---

## 📍 Location Services

Google Maps and location services were integrated into the platform to support customer and order location handling.

The system can capture and store location information associated with customer/order workflows.

This allows location data to be used as part of the order and delivery process.

---

## 🔔 Firebase Cloud Messaging

The backend integrates **Firebase Cloud Messaging (FCM)** to provide push notifications.

Notifications were used to keep administrators informed about new order activity through the dedicated Admin application.

### Notification workflow

```text
Customer Places Order
        ↓
Backend Processes Order
        ↓
Firebase Cloud Messaging
        ↓
Admin Mobile Application
        ↓
Push Notification
```

The backend also provides notification management endpoints for sending, retrieving, and deleting stored notifications.

---

## 🏗️ Backend Architecture

The backend follows a modular Express.js structure:

```text
AlMadina-App-APIs/
│
├── apis/
│   ├── userapi.js
│   ├── productapi.js
│   ├── categoryapi.js
│   ├── orderapi.js
│   ├── adsapi.js
│   └── notificationapi.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Orders.js
│   ├── ads.js
│   └── Notification.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── package.json
└── server.js
```

---

## 🔌 API Modules

| Module         | Main Responsibilities                                  |
| -------------- | ------------------------------------------------------ |
| Users          | Authentication, profiles, favorites, password recovery |
| Products       | Product CRUD, search, filtering, stock                 |
| Categories     | Category CRUD and organization                         |
| Orders         | Order creation, history, details, status management    |
| Advertisements | Promotional content management                         |
| Notifications  | Firebase push notifications and notification storage   |

---

## 🧩 Data Models

### User

Stores customer and account information including:

* Name
* Email
* Password
* Role
* Phone
* Address
* Date of Birth
* Gender
* Favorites

### Product

Stores:

* Product name
* Price
* Unit
* Discount
* Stock
* Image
* Category

### Category

Stores:

* Name
* Description
* Image
* Creation date

### Order

Stores:

* Customer
* Ordered products
* Quantities
* Total price
* Address
* Phone
* Status
* Creation date

### Advertisement

Stores:

* Associated product
* Advertisement title
* Creation date

### Notification

Stores:

* Title
* Body
* Creation date

---

## 🧰 Tech Stack

### Mobile

* Flutter
* Dart

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt
* OTP verification

### Services & Integrations

* Firebase Cloud Messaging
* Firebase Admin SDK
* Google Maps
* Location Services

---

## 🔄 System Architecture

```text
┌───────────────────────────────┐
│       Customer Flutter App    │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│       Node.js / Express       │
│           Backend             │
├───────────────────────────────┤
│ Authentication                │
│ Products                      │
│ Categories                    │
│ Advertisements                │
│ Orders                        │
│ Notifications                 │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐  ┌──────────────────┐
│   MongoDB    │  │ Firebase / FCM   │
└──────────────┘  └──────────────────┘
                ▲
                │
                │ REST API
                │
┌───────────────┴───────────────┐
│        Admin Flutter App      │
└───────────────────────────────┘
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Amrnaassar/AlMadina-App-APIs.git

cd AlMadina-App-APIs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and configure the required application settings.

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Firebase configuration should also be provided according to the Firebase Admin SDK setup used by the application.

### 4. Start the server

```bash
npm start
```

The API will be available locally through the configured port.

---

## 📱 Mobile Applications

The backend was originally integrated with two Flutter applications:

### Customer App

A customer-facing supermarket application providing:

* Product discovery
* Offers
* Shopping cart
* Ordering
* Account management
* Location services

### Admin App

A Flutter-based administration application providing:

* Product management
* Category management
* Advertisement management
* Order monitoring
* Order status management
* Push notifications

> The original Flutter source code is no longer available in this repository. Screenshots of the original applications are included below to demonstrate the implemented user interfaces and workflows.

---

## 📸 Screenshots

### Customer Application

> Screenshots of the original customer application will be added here.

### Admin Application

> Screenshots of the original admin application will be added here.

---

## 📈 Project Highlights

* Full-stack mobile e-commerce solution
* Customer and Admin applications
* RESTful API architecture
* JWT authentication
* OTP-based account workflows
* MongoDB data modeling
* Product and category management
* Cart and order processing
* Order status management
* Firebase push notifications
* Google Maps and location integration
* Admin-side business management
* Production deployment and Google Play release

---

## 👨‍💻 Development

This project was developed as an end-to-end supermarket e-commerce solution, covering mobile application development, backend API development, database integration, third-party service integration, and application deployment.

---

## 📄 License

This project is intended for portfolio and demonstration purposes.
