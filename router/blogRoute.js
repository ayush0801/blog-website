const {Router} = require('express');
const blogController = require('../controllers/blogController');
const blogModel = require('../models/BlogModel');
const requireAuth = require('../middleware/authMiddleware');
const router = Router();

router.get('/posts', requireAuth, blogController.all_posts_get);
router.post('/posts', requireAuth, blogController.add_blog_post);
router.get('/posts/:id', requireAuth, blogController.get_particular_blog_get);
router.delete('/posts/:id', requireAuth, blogController.delete_post);
router.put('/posts/:id', requireAuth, blogController.update_post);

// router.get('/posts', blogController.all_posts_get);
// router.post('/posts', blogController.add_blog_post);
// router.get('/posts/:id', blogController.get_particular_blog_get);
// router.delete('/posts/:id', blogController.delete_post);
// router.put('/posts/:id', blogController.update_post);

module.exports = router;   