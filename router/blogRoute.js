const {Router} = require('express');
const blogController = require('../controllers/blogController');
const blogModel = require('../models/BlogModel');

const router = Router();

router.get('/posts', blogController.all_posts_get);
router.post('/posts', blogController.add_blog_post);
router.get('/posts/:id', blogController.get_particular_blog_get);
router.delete('/posts/:id', blogController.delete_post);
router.put('/posts/:id', blogController.update_post)

module.exports = router;   