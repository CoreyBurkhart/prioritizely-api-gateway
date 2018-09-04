import mongoose from 'mongoose';
import UserSchema from '../schema/User';

export default mongoose.model('user', UserSchema);
