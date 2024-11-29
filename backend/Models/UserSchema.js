import dbLocal from "db-local";
import { standardizeDate } from "../Utils/date/dateUtils.js";

const { Schema } = new dbLocal({ path: "../databases" });

const UserSchema = Schema("User", {
    _id: { type: Number, required: true },
    username: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9_]{3,20}$/.test(v);
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'staff', 'guest']
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: ""
    },
    createdAt: {
        type: String,
        default:()=>standardizeDate(new Date()),
        transform: standardizeDate
    },
    lastLogin: {
        type: String,
        default: ()=>standardizeDate(new Date()),
        transform: standardizeDate
    }
});

export { UserSchema };