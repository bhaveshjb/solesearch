import express from 'express';

const adminRoutes = require('./admin');
const userRoutes = require('./user');
const apiRoutes = require('./common/index');
// const adminPanelRoutes = require('./common/adminPanelRoutes');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/api', apiRoutes);
// router.use('/', adminPanelRoutes);
module.exports = router;
