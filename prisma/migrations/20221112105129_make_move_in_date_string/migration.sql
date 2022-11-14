-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "nationalId" INTEGER NOT NULL,
    "vehicleRegistration" TEXT,
    "arrears" INTEGER,
    "moveInDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Tenant" ("arrears", "createdAt", "email", "id", "mobile", "moveInDate", "name", "nationalId", "updatedAt", "vehicleRegistration") SELECT "arrears", "createdAt", "email", "id", "mobile", "moveInDate", "name", "nationalId", "updatedAt", "vehicleRegistration" FROM "Tenant";
DROP TABLE "Tenant";
ALTER TABLE "new_Tenant" RENAME TO "Tenant";
CREATE UNIQUE INDEX "Tenant_mobile_key" ON "Tenant"("mobile");
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
