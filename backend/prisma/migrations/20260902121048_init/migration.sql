-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "district" TEXT,
    "image" TEXT,
    "party" TEXT,
    "state" TEXT,
    "jurisdiction_id" TEXT NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "person_state_idx" ON "person"("state");

-- CreateIndex
CREATE INDEX "person_party_idx" ON "person"("party");

-- CreateIndex
CREATE INDEX "person_state_party_idx" ON "person"("state", "party");
