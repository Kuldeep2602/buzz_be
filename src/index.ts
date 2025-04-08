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
app.use(cors());

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
    const link = req.body.link;
    const type = req.body.type;
  
    await ContentModel.create({
      link,
      type,
      title: req.body.title, // Ensure title is included in the request body
      // @ts-ignore
      userId: req.userId,
      tags: []
    });
    console.log(link); // Log the link for debugging
  
    res.json({ message: "Content added" }); // Send the response
  });



app.get('/api/v1/content', userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    console.log(content); // Log the content for debugging
    res.json({
        content
    })
})

app.delete('/api/v1/content',userMiddleware, async (req, res) => {
    console.log("Delete route hit with body:", req.body);
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
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
  
