import {loginAttemptSchema} from '../../Models/loginAttempt.js';
import { standardizeDate } from '../../Utils/date/dateUtils.js';

export const saveLoginAttempt = async (
    username,
     success,
    //  ipAddress
    ) => {
    try {
        const attempt = new loginAttemptSchema({
            username,
            success,
            // ipAddress,
            timestamp: standardizeDate(new Date())
        });
        
        await attempt.save();
        return attempt;
    } catch (error) {
        throw new Error(`Error saving login attempt: ${error.message}`);
    }
};

export const getLoginAttempts = async (username, minutes = 15) => {
    try {
        const timeLimit = new Date(Date.now() - minutes * 60 * 1000);
        
        const attempts = await loginAttemptSchema.find({
            username,
            timestamp: { $gte: timeLimit }
        }).sort({ timestamp: -1 });
        
        return attempts;
    } catch (error) {
        throw new Error(`Error getting login attempts: ${error.message}`);
    }
}; 