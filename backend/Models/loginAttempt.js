import dbLocal from "db-local";
import { standardizeDate } from "../Utils/date/dateUtils.js";
const { Schema } = new dbLocal({ path: "../databases" });


const loginAttemptSchema = Schema("loginAttempt", {
    username: {
        type: String,
        required: true,
        index: true
    },
    success: {
        type: Boolean,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
    }
});

export { loginAttemptSchema };