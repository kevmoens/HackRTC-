import { model, Schema } from "mongoose";

const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
  },

  users: [
    {
      userToken: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
      },
      score: {
        type: Number,
        default: 0,
      },
      checkedItems: {
        type: Schema.Types.Array,
      },
    },
  ],

  items: {
    type: Schema.Types.Array,
  },
});

export const Room = model("room", roomSchema);
