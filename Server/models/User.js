import mongoose from "mongoose";


const Userschema = new mongoose.Schema({

      google_id: {
            type: String
      },
      phone: {
            type: String

      },
      email: {
            type: String,
            required: true,
            unique: true

      },
      userphoto: {
            type: String

      },
      password: {
            type: String,
      },


}, { timestamps: true });
const User = mongoose.model('User', Userschema);
export default User;