-- AlterTable
ALTER TABLE `Conversation`
  DROP COLUMN `model`,
  DROP COLUMN `temperature`,
  DROP COLUMN `maxTokens`,
  DROP COLUMN `contextWindow`;
