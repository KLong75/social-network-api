const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
    { 
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      reactionText: {
        type: String,
        required: [true, 'Please type your reaction'],
        trim: true,
        maxLength: 280
      },
      userName: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    },
    {
      toJSON: {
        getters: true
      },
    }
  );

const ThoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: [true, 'Please type your thought'],
        trim: true,
        maxLength: 280 
      },
      userName: {
        type: String,
        required: [true, 'Valid username is required'],
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      },
      reactions: [ReactionSchema]
    },
    {
      toJSON: {
        virtuals: true,
        getters: true
      },
      id: false
    }
  );

ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);
  
module.exports = Thought;