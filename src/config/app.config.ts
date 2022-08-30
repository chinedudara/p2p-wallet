import * as dotenv from "dotenv";
dotenv.config()

export const common_config = {
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG || false,
    tokenSecret: process.env.AUTH_SECRET || "secret",
}

export const payment_integration = {
    public_key: process.env.PAYSTACK_PUBLIC_KEY || "",
    secret_key: process.env.PAYSTACK_SECRET_KEY || "",
    verification_url: 'https://api.paystack.co/transaction/verify/',
    payment_url: 'https://api.paystack.co/transaction/initialize'
}

export const transaction_status = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
}