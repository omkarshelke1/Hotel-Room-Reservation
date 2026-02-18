# Payment Service - Razorpay Integration

A microservice for handling payments using Razorpay for the Hotel Booking System.

## Overview

This service runs independently on **port 8082** and handles all payment-related operations including:
- Creating Razorpay payment orders
- Verifying payment signatures
- Storing payment records
- Handling Razorpay webhooks

## Quick Start

### Prerequisites
- Java 21
- Maven
- MySQL 8.0+
- Razorpay Test Account

### Setup

1. **Create Database**:
```sql
CREATE DATABASE hotel_payment_db;
```

2. **Configure Razorpay Credentials**:
   
Edit `src/main/resources/application.properties`:
```properties
razorpay.key.id=YOUR_TEST_KEY_ID
razorpay.key.secret=YOUR_TEST_SECRET
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

3. **Build & Run**:
```bash
mvn clean install
mvn spring-boot:run
```

Service will start on: http://localhost:8082

## API Endpoints

### POST /api/payments/create-order
Create a new payment order

**Request:**
```json
{
  "bookingId": 1,
  "userId": 1,
  "amount": 5000.0,
  "currency": "INR"
}
```

**Response:**
```json
{
  "paymentId": 1,
  "razorpayOrderId": "order_XXXXXX",
  "amount": 5000.0,
  "currency": "INR",
  "razorpayKeyId": "rzp_test_XXXXX"
}
```

### POST /api/payments/verify
Verify payment signature after checkout

**Request:**
```json
{
  "razorpayOrderId": "order_XXXXXX",
  "razorpayPaymentId": "pay_XXXXXX",
  "razorpaySignature": "signature_string"
}
```

### GET /api/payments/booking/{bookingId}
Get all payments for a booking

### GET /api/payments/user/{userId}
Get all payments for a user

### POST /api/payments/webhook
Razorpay webhook endpoint (for production)

## Testing

Use Razorpay test cards:
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

## Dependencies

- Spring Boot 3.2.2
- Razorpay Java SDK 1.4.6
- MySQL Connector
- Lombok
- Spring Data JPA

## Architecture

```
Payment Service (8082)
    ↓
Razorpay API
    ↓
Payment Database (hotel_payment_db)
```

## Security

- Payment signature verification using HMAC SHA256
- CORS enabled for frontend (localhost:5173)
- Webhook signature validation
- Transaction logging

## Environment Variables (Production)

```bash
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
DB_URL=jdbc:mysql://prod-host:3306/hotel_payment_db
DB_USERNAME=prod_user
DB_PASSWORD=secure_password
```

## Author

Created for Hotel Booking System
