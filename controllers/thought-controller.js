const { Thought, User } = require('../models');

const thoughtController = {
  // add thought 
  addThought( { params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { userName: body.userName },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
  },
  // get one thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {
        // if no thought found send 404
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // update thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought found with this id' });
      return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  },
  // delete thought by id
  removeThought({ params, body }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id' });
        }
        res.status(200).json({ message: 'Thought has been deleted' });
        
        return User.findOneAndUpdate(
          { userName: body.userName },
          { $pull: { thoughts: params.id } },
          { new: true, },
        );
      })   
  },
  // add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },
  // delete reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
    if (!dbThoughtData) {
      return res.status(404).json({ message: 'No thought with this id' });
    }
    res.status(200).json({ message: 'Reaction has been deleted' });
    })
    .catch(err => res.json(err)); 
  }
};

module.exports = thoughtController;