
//create user schema
import mongoose, {model , Schema} from "mongoose";

mongoose.connect("xxxxxx")

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags:[{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId:[{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
})

export const ContentModel = model("Content", ContentSchema);

// const userSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     }
// });
