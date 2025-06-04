"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // zod validation and hash password 
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield db_1.UserModel.create({
            username: username,
            password: password
        });
        res.json({
            message: "User signed up successfully"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "Username already exists"
        });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Invalid username or password"
        });
    }
}));
app.post('/api/v1/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title, content, category } = req.body;
    // Prepare the content object based on type
    let contentObj = {
        type,
        title,
        // @ts-ignore
        userId: req.userId,
        tags: []
    };
    if (type === 'youtube' || type === 'twitter') {
        contentObj.link = link;
    }
    else if (type === 'minddrop') {
        contentObj.content = content;
    }
    else if (type === 'savedlink') {
        contentObj.link = link;
        if (category)
            contentObj.category = category;
    }
    yield db_1.ContentModel.create(contentObj);
    console.log('Content created:', contentObj);
    res.json({ message: "Content added" });
}));
app.get('/api/v1/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    // The new schema supports type, content, category fields
    res.json({
        content
    });
}));
app.delete('/api/v1/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Delete route hit with body:", req.body);
    const contentId = req.body.contentId;
    yield db_1.ContentModel.deleteOne({
        _id: contentId,
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        message: "Content deleted"
    });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
    else {
        yield db_1.LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "Link deleted"
        });
    }
}));
app.post('/api/v1/brain/:shareLink', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    const content = yield db_1.ContentModel.findOne({
        userId: link.userId
    });
    const user = yield db_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "Sorry user not found"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
// app.listen(3000);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
