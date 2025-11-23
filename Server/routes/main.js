const express = require('express');
const router = express.Router();
const Post = require("../models/post")

// GET
// HOME
router.get('', async (req, res)=>{
    
    try{
        const locals = {
        title: "Footprint",
        description: "Simple Blog created using NodeJs Express and Mongodb"
        }
        let perPage =5;
        let page = req.query.page || 1;
        const data = await Post.aggregate([ {  $sort: {createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', { 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    }catch(error){
        console.log(error);
        
    }
});

// router.get('', async (req, res)=>{
//     const locals = {
//         title: "NodeJs Blog",
//         description: "Simple Blog created using NodeJs Express and Mongodb"
//     }
//     try{
//         const data = await Post.find();
//         res.render('index', { locals, data });

//     }catch(error){
//         console.log(error);
//     }
// });


// GET
// Post: id

router.get('/post/:id', async (req, res)=>{

    try{
        let slug = req.params.id;
        const data = await Post.findById(slug);

        if (!data) {
            return res.status(404).render("404"); // optional but safe
        }

        const locals = {
            title: data.title,
            description: "Simple Blog created using NodeJs Express and Mongodb",
            currentRoute: `/post/${slug}`

        }
        res.render('post', {
            locals,
            data
        });

    }catch(error){
        console.log(error);
        res.status(500).send("Server Error");

    }
});


// Post
// Post: searchTerm


router.post('/search', async (req, res)=>{
    try{
        const locals = {
            title: "Search",
            description: "Simple Blog created using NodeJs Express and Mongodb"
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, ""); 
        
        const data = await Post.find({
            $or: [
                { title: {$regex: new RegExp(searchNoSpecialChar, 'i')} },
                { body: {$regex: new RegExp(searchNoSpecialChar, 'i')} }
            ]
        });

        res.render('search', {
            data, locals
        });

    }catch(error){
        console.log(error);
    }
});














router.get('/about', (req, res)=>{
    res.render("about",{
        currentRoute: '/about'

    });
});

// GET
// Gallery - Image

router.get('/gallery', (req, res) => {
    const locals = {
        title: "Gallery",
        description: "Travel photos from my journeys across India"
    };

    // Add image filenames here (we will add images next)
    const media = [
        { type: "image", file: "Img1.jpg" },
        { type: "image", file: "Img2.jpg" },
        { type: "image", file: "Img3.jpg" },
        { type: "image", file: "Img4.jpg" },
        { type: "image", file: "Img5.jpg" },
        { type: "image", file: "Img13.jpeg" },
        { type: "video", file: "Video1.mp4" },  
        { type: "image", file: "Img6.jpg" },
        { type: "image", file: "Img7.jpg" },
        { type: "image", file: "Img8.jpg" },
        { type: "video", file: "video2.mp4" },
        { type: "image", file: "Img9.jpg" },
        { type: "image", file: "Img14.jpeg" },
        { type: "image", file: "Img11.jpeg" },
        { type: "image", file: "Img12.jpeg" },
        { type: "video", file: "video3.mp4" },
        { type: "image", file: "Img15.jpg" },
        { type: "image", file: "Img16.jpg" },
        { type: "image", file: "Img17.jpg" },
        { type: "image", file: "Img18.jpg" },
        { type: "video", file: "video4.mp4" },


    ];

    res.render('gallery', { locals, media });
});

// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body text"
//         },
//         {
//             title: "Understanding REST APIs in Node.js",
//             body: "Learn what REST APIs are, how they work, and how to build clean and scalable endpoints using Node.js and Express."
//         },
//         {
//             title: "Working with Middleware in Express.js",
//             body: "Explore how middleware functions work in Express.js and learn how to build reusable and powerful request handlers."
//         },
//         {
//             title: "Building a Simple CRUD Application Using Node and MongoDB",
//             body: "Understand how to create, read, update, and delete data using MongoDB and Mongoose inside a Node.js application."
//         },
//         {
//             title: "Template Engines Explained — EJS for Beginners",
//             body: "Learn how EJS templates work and how to render dynamic content from Node.js to the frontend using Express."
//         },
//         {
//             title: "Understanding MVC Architecture in Node.js Projects",
//             body: "Discover how to structure your project using the Model-View-Controller pattern to keep your code clean and scalable."
//         },
//         {
//             title: "Securing Your Node.js Application",
//             body: "Learn techniques such as environment variables, password hashing, and input validation to secure your Node.js apps."
//         },
//         {
//             title: "File Uploads in Node.js Using Multer",
//             body: "Understand how to upload images, documents, and other files in a secure way using Multer middleware."
//         },
//         {
//             title: "Using Fetch API to Communicate With Your Node.js Backend",
//             body: "Learn how the browser communicates with the backend using Fetch API and how to handle JSON, POST requests, and headers."
//         },
//         {
//             title: "Understanding JSON Web Tokens (JWT) in Node.js",
//             body: "Explore how JWT works and how it helps you build secure authentication systems in Express applications."
//         },
//         {
//             title: "How to Use Nodemailer to Send Emails From Node.js",
//             body: "Learn how to send signup confirmation, password reset, and contact form emails using Nodemailer."
//         }

//     ])
// }
// insertPostData();



module.exports = router;