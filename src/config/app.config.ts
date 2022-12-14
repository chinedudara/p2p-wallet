import * as dotenv from "dotenv";
dotenv.config()

export const common_config = {
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG || false,
    tokenSecret: process.env.AUTH_SECRET || "secret",
    tokenTimespan: 1800,
}

export const payment_integration = {
    public_key: process.env.PAYSTACK_PUBLIC_KEY || "",
    secret_key: process.env.PAYSTACK_SECRET_KEY || "",
    verification_url: 'https://api.paystack.co/transaction/verify/',
    payment_url: 'https://api.paystack.co/transaction/initialize',
    valid_ips: ["52.31.139.75", "52.49.173.169", "52.214.14.220"]
}

export const transaction_status = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
}