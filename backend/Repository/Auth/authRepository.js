import { UserSchema } from '../../Models/UserSchema.js';
import { DeletionLogSchema } from '../../Models/LogSchema.js';

export const saveLoginAttempt = async (username, success) => {
    try {
        const log = await DeletionLogSchema.create({
            username,
            action: 'login_attempt',
            success,
            timestamp: new Date()
        });
        return await log.save();
    } catch (error) {
        throw new Error(`Error saving login attempt: ${error.message}`);
    }
};

export const getLoginAttempts = async (username, timeWindow) => {
    try {
        return await DeletionLogSchema.find({
            username,
            action: 'login_attempt',
            timestamp: { $gte: timeWindow }
        });
    } catch (error) {
        throw new Error(`Error getting login attempts: ${error.message}`);
    }
}; 