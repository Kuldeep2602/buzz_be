
//create user schema
import mongoose, {model , Schema} from "mongoose";

mongoose.connect("mongodb+srv://Kuldeepsingh:Kuldeep%40123@cluster0.jnmfv.mongodb.net/brainly?retryWrites=true&w=majority&appName=cluster0")

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema);


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