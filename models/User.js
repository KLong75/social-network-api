const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
{ 
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    unique: true,
    required: [true, 'User email address required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
      },
      message: props => `${props.value} is not a valid email address.`
    }
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
},
{
  toJSON: {
      virtuals: true,
  },
    id: false
});

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});
  
const User = model('User', UserSchema);
  
module.exports = User;
  