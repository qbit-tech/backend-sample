'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // Then, we do some calls passing this transaction as an option:
      console.info('start create idx_transactions_transactioncode');
      await queryInterface.sequelize.query(`
      create unique index idx_transactions_transactioncode on transactions ("transactionCode")
      `, { transaction: t });
      console.info('finish create idx_transactions_transactioncode');
      
      console.info('start create idx_transactions_createdat');
      await queryInterface.sequelize.query(`
      create index idx_transactions_createdat on transactions ("createdAt")
      `, { transaction: t });
      console.info('finish create idx_transactions_transactioncode');
      
      console.info('start create idx_transactions_buyerid');
      await queryInterface.sequelize.query(`
      create index idx_transactions_buyerid on transactions ("buyerId")
      `, { transaction: t });
      console.info('finish create idx_transactions_buyerid');
      
      console.info('start create idx_transactions_transactionstatus');
      await queryInterface.sequelize.query(`
      create index idx_transactions_transactionstatus on transactions ("transactionStatus")
      `, { transaction: t });
      console.info('finish create idx_transactions_transactionstatus');

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();
      return;
    } catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
      console.error('error', error);
      throw new Error('Failed migration set_index_transaction, rollback');
    }
  },
  down: async (queryInterface, Sequelize) =>{
    const t = await queryInterface.sequelize.transaction();

    try {
      // Then, we do some calls passing this transaction as an option:
      await queryInterface.sequelize.query(
        `
        drop index idx_transactions_transactioncode
      `,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `
        drop index idx_transactions_createdat
      `,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `
        drop index idx_transactions_buyerid
      `,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `
        drop index idx_transactions_transactionstatus
      `,
        { transaction: t },
      );

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();
      return;
    } catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
      console.error('error', error);
      throw new Error('Failed migration set_index_transaction, rollback');
    }
  }
};
