const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../Middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
     .populate("comments.postedBy","_id name")
     .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allfollowpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
     .populate("comments.postedBy","_id name")
     .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,snap} = req.body   
     if(!title || !body || !snap){
        return res.status(422).json({error:"Add all the fields first"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:snap,
        postedBy:req.user
    }
)
post.save().then(result=>{
    res.json({post:result})
})
.catch(err=>{
    console.log(err)

})
})
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.put('/like',requireLogin,(req,res)=>{
   
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/dislike',requireLogin,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name") 
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.delete('/deletecomment/:comments.postedBy._id',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.comments.postedBy._id})
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id")
    .exec((err,comments)=>{
        if(err || !comments){
            return res.status(422).json({error:err})
        }
        if(post.comments.postedBy._id.toString() === req.user._id.toString()){
            post.comments.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})




module.exports = router