import migrateMongo from 'migrate-mongo';
import { logger } from './config/logger';

function migrate() {
  migrateMongo.database
    .connect()
    .then(({ db }) => migrateMongo.up(db))
    .catch((error) => {
      logger.error(error);
    });
}

module.exports = migrate;
