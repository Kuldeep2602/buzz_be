import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { LinkModel ,ContentModel, UserModel } from './db';
import {JWT_PASSWORD} from "./config"
import { userMiddleware } from './middleware';
import { random } from './utils';
import cors from 'cors';


const app = express();
app.use(express.json());
// Configure CORS for production
const allowedOrigins = [
    'https://buzz-fe-1.vercel.app',  // Production frontend
    'http://localhost:5173'           // Local development
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.post('/api/v1/signup', async (req, res) => {
    // zod validation and hash password 
    const username = req.body.username;
    const password = req.body.password;

    try{
        await UserModel.create({
            username: username,
            password: password
        })
    
        res.json({
            message: "User signed up successfully"
        })
    }catch(e){
        res.status(411).json({
            message:"Username already exists"
        })
    }    
})

app.post('/api/v1/signin',async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if(existingUser){
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)
        res.json({
            token
        })
    }else{
        res.status(403).json({
            message: "Invalid username or password"
        })
    }
})


app.post('/api/v1/content', userMiddleware, async (req, res) => {
    const { link, type, title, content, category } = req.body;

    // Prepare the content object based on type
    let contentObj: any = {
      type,
      title,
      // @ts-ignore
      userId: req.userId,
      tags: []
    };

    if (type === 'youtube' || type === 'twitter') {
      contentObj.link = link;
    } else if (type === 'minddrop') {
      contentObj.content = content;
    } else if (type === 'savedlink') {
      contentObj.link = link;
      if (category) contentObj.category = category;
    }

    await ContentModel.create(contentObj);
    console.log('Content created:', contentObj);
    res.json({ message: "Content added" });
});



app.get('/api/v1/content', userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    // The new schema supports type, content, category fields
    res.json({
        content
    })
})

app.delete('/api/v1/content',userMiddleware, async (req, res) => {
    console.log("Delete route hit with body:", req.body);
    const contentId = req.body.contentId;

    await ContentModel.deleteOne({
        _id: contentId,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "Content deleted"
    })
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share; 
    if(share){
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });

        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
            return;
        }

        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        })

        res.json({
          hash
        })
    }else{
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });

        res.json({
            message: "Link deleted"
        })
    }
})

app.post('/api/v1/brain/:shareLink',userMiddleware, async(req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    })

    if(!link){
        res.status(411).json({
            message:"Sorry incorrect input"
        })
        return ;
    }

    const content = await ContentModel.findOne({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })

    if(!user){
        res.status(411).json({
            message:"Sorry user not found"
        })
        return ;
    }



    res.json({
        username: user.username,
        content: content
    })
})

// app.listen(3000);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
  
