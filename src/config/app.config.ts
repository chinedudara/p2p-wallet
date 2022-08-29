export const payment_integration = {
    public_key: process.env.PAYSTACK_PUBLIC_KEY,
    secret_key: process.env.PAYSTACK_SECRET_KEY,
    verification_url: 'https://api.paystack.co/transaction/verify/'
}

export const transaction_status = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
}