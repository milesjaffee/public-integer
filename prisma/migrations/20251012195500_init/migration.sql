-- CreateTable
CREATE TABLE "IntegerValue" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "value" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegerValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegerHistory" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegerHistory_pkey" PRIMARY KEY ("id")
);
