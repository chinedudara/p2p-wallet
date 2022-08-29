-- CreateTable
CREATE TABLE "deposit_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "account_number" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transaction_ref" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deposit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "source_account" TEXT NOT NULL,
    "destination_account" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transaction_ref" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfer_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deposit_log" ADD CONSTRAINT "deposit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_log" ADD CONSTRAINT "transfer_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
