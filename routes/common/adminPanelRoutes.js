import express from 'express';
// import path from 'path';
import bcrypt from 'bcryptjs';
import { AdminUsers } from '../../models';
import validate from '../../middlewares/validate';
import { authValidation } from '../../validations/admin';
import { logger } from '../../config/logger';

const router = express.Router();
router.get('/', (req, res) => {
  res.render('index.ejs', {
    user: {
      is_authenticated: false,
      login: 'admin',
    },
  });
});
router.get('/login-page', (req, res) => {
  res.render('form.ejs', {
    form: {
      usename: 'abc',
      password: 123,
    },
  });
});
router.route('/login').post(validate(authValidation.login), async (req, res) => {
  // router.route('/login').get(async (req, res) => {
  const form = [req.body];
  try {
    const user = await AdminUsers.findOne({ username: req.body.username });
    if (user) {
      const validatePassword = await bcrypt.compare(req.body.password, user.password);
      if (validatePassword) {
        req.session.user = user.toJSON();
        res.redirect('admin');
      }
    }
    res.render('form.ejs', { form });
  } catch (e) {
    logger.error(`error from admin login : ${e.message}`);
  }
});
// router.get('/admin', (req, res) => {
//   res.render('index.ejs', {
//     user: {
//       is_authenticated: false,
//       login: 'admin',
//     },
//   });
// });

// router
//   .route('/login')
//   .get((req, res) => {
//     console.log('req login=> ', req);
//     res.render(`form.ejs`, { form: req.body });
//   })
//   .post(async (req, res) => {
//     console.log('req post=> ', req);
//     try {
//       const user = await AdminUsers.findOne({ username: req.body.username });
//       const validatePassword = await bcrypt.compare(req.body.password, user.password);
//       if (user && validatePassword) {
//         res.redirect('/admin-panel/admin');
//       } else {
//         res.send({ error: 'invalid username or password' });
//       }
//     } catch (error) {
//       throw new Error(`error in admin-panel login: ${error.message}`);
//     }
//   });
module.exports = router;
