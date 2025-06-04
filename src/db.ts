import mongoose, {model , Schema} from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI not defined in environment variables");
}

mongoose.connect(MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));


const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String, // For youtube, twitter, savedlink
    content: String, // For minddrop (note body)
    type: {
      type: String,
      enum: ['youtube', 'twitter', 'minddrop', 'savedlink'],
      required: true
    },
    category: String, // Optional, for savedlink
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
})

const LinkSchema = new Schema({
    hash: {type: String, required: true},

    userId:[{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
})


export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);


