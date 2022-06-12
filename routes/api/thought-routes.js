const router = require('express').Router();

const {
  getAllThoughts,
  getThoughtById, 
  addThought,
  updateThought, 
  removeThought, 
  addReaction, 
  removeReaction 
} = require('../../controllers/thought-controller');

// api/thoughts/
router
  .route('/')
  .post(addThought)
  .get(getAllThoughts);

// api/thoughts/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .post(addReaction)
  .delete(removeThought);

router
  .route('/:id/reactions/:reactionId')
  .delete(removeReaction);

module.exports = router;