/*
  Warnings:

  - You are about to drop the column `arrears` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `paidMonth` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidYear` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Arrear" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Arrear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paidMonth" TEXT NOT NULL,
    "paidYear" TEXT NOT NULL,
    "tenantId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "createdAt", "id", "tenantId", "type", "updatedAt") SELECT "amount", "createdAt", "id", "tenantId", "type", "updatedAt" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "nationalId" INTEGER NOT NULL,
    "vehicleRegistration" TEXT,
    "moveInDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Tenant" ("createdAt", "email", "id", "mobile", "moveInDate", "name", "nationalId", "updatedAt", "vehicleRegistration") SELECT "createdAt", "email", "id", "mobile", "moveInDate", "name", "nationalId", "updatedAt", "vehicleRegistration" FROM "Tenant";
DROP TABLE "Tenant";
ALTER TABLE "new_Tenant" RENAME TO "Tenant";
CREATE UNIQUE INDEX "Tenant_mobile_key" ON "Tenant"("mobile");
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
