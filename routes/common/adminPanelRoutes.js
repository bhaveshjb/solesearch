import express from 'express';
// import path from 'path';
import bcrypt from 'bcryptjs';
import { AdminUsers } from '../../models';
import validate from '../../middlewares/validate';
import { authValidation } from '../../validations/admin';
import { logger } from '../../config/logger';

const router = express.Router();

let loggedIn;
router.get('/', (req, res) => {
  res.render('index.ejs', { user: loggedIn });
});

router.route('/login').post(validate(authValidation.login), async (req, res) => {
  try {
    const user = await AdminUsers.findOne({ username: req.body.username });
    if (user) {
      const validatePassword = await bcrypt.compare(req.body.password, user.password);
      if (validatePassword) {
        loggedIn = true;
        res.redirect('../admin');
      }
      res.send('Invalid username or password');
    }
  } catch (e) {
    logger.error(`error from admin login : ${e.message}`);
  }
});

router.get('/login', (req, res) => {
  res.render('form.ejs');
});

router.get('/logout', (req, res) => {
  loggedIn = false;
  res.redirect('../admin/logout');
});
module.exports = router;
