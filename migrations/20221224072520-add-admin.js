import config from 'config/config';

const { AdminUsers } = require('../models');

module.exports = {
  async up() {
    await AdminUsers.create({ username: config.superUser.username, password: config.superUser.password });
  },
};
