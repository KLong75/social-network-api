const { User, Thought } = require('../models');

const UserController = {
  //get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => {
        // if no user found send 404
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id'});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //createUser
  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
  },

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .then(dbUserData => {
      if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  },

  // delete user by id
  deleteUser({ params, body }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.status(200).json({ message: 'User and thoughts posted by user have been deleted' });

        Thought.deleteMany({ thoughts: body.thoughts })  
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            return;
          }
        })
        .catch(err => res.status(400).json(err)); 
      })
      .catch(err => res.status(400).json(err));     
  },
  // add friend to user
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    
    })
    .catch(err => res.json(err));
  },
  // delete friend from user
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },
};

module.exports = UserController;