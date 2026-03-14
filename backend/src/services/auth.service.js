import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {cfg} from "../config/env.js";
export class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
  
    async register(name, email, password) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({ 
            name, 
            email, 
            password: hashedPassword
        });

        const savedUser = await user.save();
        const { password: _, ...safeUser } = savedUser.toObject();
        return safeUser;
    }

    async login(email, password) {
        const user = await this.userModel.findOne({ email }).select('name email password role');
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, cfg.jwtSecret, { expiresIn: '1h' });
        const { password: _, ...safeUser } = user.toObject();
        return { ...safeUser, token };
    }




    async getAllUsers() {
        return await this.userModel.find({}, { password: 0 });
    }
}