-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
