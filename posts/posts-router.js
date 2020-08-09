const express = require("express")
const posts = require("../data/db.js")
const { OPEN_READWRITE } = require("sqlite3")

const router = express.Router()

router.post("/api/posts", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post." 
        })
    }

    posts.insert(req.body)
        .then((post) => {
            res.status(201).json(post)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "There was an error while saving the post to the database"
            })
        })
})

router.post("/api/posts/:id/comments", (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({
            errorMessage: "Please provide text for the comment."
        })
    } else {
        posts.findById(req.params.id)
        .then((post) => {
            if (post) {
                posts.insertComment(req.body)
                .then((comment) => {
                    res.status(200).json(comment)
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500).json({
                        error: "There was an error while saving the comment to the database"
                    })
                })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
    }


    posts.insertComment(req.params.id, req.body)
        .then((comment) => {
            if (comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "There was an error while saving the comment to the database"
            })
        })
})

router.get("/api/posts", (req, res) => {
    posts.find()
        .then((posts) => {
            res.status(200).json(posts)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})

router.get("/api/posts/:id", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
})

router.get("/api/posts/:id/comments", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            if (post) {
                posts.findPostComments(req.params.id)
                    .then((comments) => {
                        res.status(200).json(comments)
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(500).json({
                            error: "The comments information could not be retrieved."
                        })
                    })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
})

router.delete("/api/posts/:id", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            if (post) {
                posts.remove(req.params.id)
                    .then((post) => {
                        res.status(202).json(post)
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(500).json({
                            error: "The post could not be removed"
                        })
                    })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
})

router.put("/api/posts/:id", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post." 
        })
    }

    posts.findById(req.params.id)
        .then((post) => {
            if (post) {
                posts.update(req.params.id, req.body)
                    .then((post) => {
                        res.status(200).json(post)
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(500).json({
                            error: "The post information could not be modified."
                        })
                    })
                    
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
})





module.exports = router