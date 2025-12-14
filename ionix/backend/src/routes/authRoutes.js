const express = require('express');
const {
  registerUser,
  loginUser,
  updateUserProfile,
  googleLogin,
  upgradeToPremium
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

// ⭐ REQUIRED FOR REFRESH
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

router.put('/profile', protect, updateUserProfile);
router.put('/premium', protect, upgradeToPremium);

module.exports = router;
