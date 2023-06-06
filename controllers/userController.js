// const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//GET USER DETAILS BY ID
module.exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
//GET INDIVIDUAL JOURNAL 
module.exports.getJournal = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const post = await Post.findById(post_id);
        const encText = post.content;
        const bytes = CryptoJS.AES.decrypt(encText, process.env.ENC_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        post.content = originalText;
        res.status(200).json({ post });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
//GEt ALL JOURNALS
module.exports.getAllPosts = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) res.status(400).json({message: "User not found" });
        const postIds = user.posts;
        const posts = [];
        for (let i = 0; i < postIds.length; i++) {
            const post = await Post.findById(postIds[i]);
            const encText = post.content;
            const bytes = CryptoJS.AES.decrypt(encText, process.env.ENC_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            post.content = originalText;
            posts.push(post);
        }
        res.status(200).json({ posts });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
//POST JOURNAL
module.exports.postJournal = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id);
        const {
            title,
            content
        } = req.body;
        const cipherText = CryptoJS.AES.encrypt(content, process.env.ENC_KEY).toString();
        const newPost = new Post({
            title,
            content: cipherText
        });
        const post = await newPost.save();

        const post_id = post._id;
        user.posts.push(post_id);
        await user.save();
        res.status(201).json({ post, user });
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
}
// UPDATE JOURNALS
module.exports.updateJournal = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        Post.updateOne({ _id: post_id }, { $set: { title: req.body.title, content: CryptoJS.AES.encrypt(req.body.content, process.env.ENC_KEY).toString() } })
            .then((result) => {
                res.status(201).json({ result });
            }).catch((err) => {
                res.status(400).json({ error: err.message });
            });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// DELETING JOURNAL 
module.exports.deleteJournal = async (req, res) => {
    const post_id = req.params.post_id;
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        const index = user.posts.indexOf(post_id);
        user.posts.splice(index, 1);
        await user.save();
        await Post.deleteOne({ _id: post_id })
            .then((result) => {
                res.status(201).json({ result });
            }).catch((err) => {
                res.status(400).json({ error: err.message });
            });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}