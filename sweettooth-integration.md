# SweetTooth Payment Center Integration Guide

This document outlines how the **SweetTooth** application can interact with the **Payment Center** to create payments and receive asynchronous webhook callbacks.

## 1. Creating a Payment

To initiate a payment, SweetTooth must make a Server-to-Server API call to the Payment Center.

**Endpoint:** `POST /api/v1/payments`
**Content-Type:** `application/json`

### Authentication Headers
You must provide your Merchant API credentials in the headers:
- `X-Access-Key`: `(Provided by Payment Center Admin)`
- `X-Secret-Key`: `(Provided by Payment Center Admin)`

### Request Payload
```json
{
  "amount": 15000,
  "currency": "THB",
  "return_url": "https://your-sweettooth-domain.com/checkout/complete"
}
```
*Note: `amount` is in minor units (satang). E.g., `15000` = 150.00 THB.*

### Response (201 Created)
```json
{
  "reference": "9fb334e6-945e-4df0-a2c6-8ef3b5bd07cf",
  "checkout_url": "http://payment-center.local/pay/9fb334e6-945e-4df0-a2c6-8ef3b5bd07cf"
}
```

> **Action:** Redirect the user's browser to the `checkout_url`. After the user completes the payment, they will be redirected back to your `return_url`.

---

## 2. Receiving Webhook Callbacks

Since payment statuses can change asynchronously (e.g., successful, failed, reversed), Payment Center will send a Server-to-Server webhook (POST request) to SweetTooth's registered `callback_url`.

**Method:** `POST`
**Endpoint:** `(Your configured callback URL, e.g., /api/webhooks/payment-center)`
**Content-Type:** `application/json`

### Callback Payload Structure
```json
{
  "reference": "9fb334e6-945e-4df0-a2c6-8ef3b5bd07cf",
  "status": "successful",
  "amount": 15000,
  "currency": "THB",
  "omise_charge_id": "chrg_test_123456789",
  "updated_at": "2026-06-06T12:00:00+00:00"
}
```

### Possible Statuses
- `pending`: The payment is initiated but not yet paid.
- `successful`: The payment was successfully captured.
- `failed`: The payment failed or was rejected.
- `reversed`: The payment was refunded or voided by Admin.
- `expired`: The payment session expired before completion.

---

## 3. Verifying the Webhook Signature

To ensure the callback truly came from Payment Center and wasn't tampered with, you **must** verify the HMAC signature provided in the headers.

### Signature Header
- `X-Payment-Signature`: A hexadecimal string of the HMAC-SHA256 signature.

### How to calculate the signature:
1. Capture the raw JSON request body exactly as received.
2. Use the **Webhook Secret** (provided by Payment Center Admin) as the HMAC key.
3. Generate an HMAC-SHA256 hash of the JSON body.
4. Compare your generated hash with the `X-Payment-Signature` header using a constant-time comparison function to prevent timing attacks.

*See the `SweetToothPaymentClient.php` sample file for a concrete PHP implementation.*
