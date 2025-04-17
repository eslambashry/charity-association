import  { model, Schema } from "mongoose";
import { token } from "morgan";

 
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  token : {type:String}
},{timeseries:true});

export const userModel = model('user', userSchema);

