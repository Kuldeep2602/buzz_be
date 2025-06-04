"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.LinkModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("MONGO_URI not defined in environment variables");
}
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: String
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
const ContentSchema = new mongoose_1.Schema({
    title: String,
    link: String, // For youtube, twitter, savedlink
    content: String, // For minddrop (note body)
    type: {
        type: String,
        enum: ['youtube', 'twitter', 'minddrop', 'savedlink'],
        required: true
    },
    category: String, // Optional, for savedlink
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }],
});
const LinkSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    userId: [{ type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }],
});
exports.LinkModel = (0, mongoose_1.model)("Links", LinkSchema);
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
