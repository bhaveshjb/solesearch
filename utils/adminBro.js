const AdminBro = require('admin-bro');
const mongooseAdminBro = require('@admin-bro/mongoose');
const AdminBroExpress = require('@admin-bro/express');
const bcrypt = require('bcryptjs');
const { User, Product, Transaction, Subscription, Bids, Flakers, VerifiedSellers, AdminUsers } = require('../models');

AdminBro.registerAdapter(mongooseAdminBro);
const AdminBroOptions = {
  resources: [User, Product, Transaction, Subscription, Bids, Flakers, VerifiedSellers],
  // rootPath: '/admin-panel/admin',
};
export const adminBro = new AdminBro(AdminBroOptions);
export const adminBroRoute = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (username, password) => {
    const user = await AdminUsers.findOne({ username });
    if (user) {
      const validatePassword = await bcrypt.compare(password, user.password);
      if (validatePassword) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: 'sessionKey',
});
