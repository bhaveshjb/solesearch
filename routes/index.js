import express from 'express';

const adminRoutes = require('./admin');
const userRoutes = require('./user');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);

module.exports = router;
