const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")

const multer = require("multer")
const { uploadOnCloudinary } = require('./utils/cloudinary');

const bodyParser = require("body-parser")
require("./db/conn")
const User = require("./db/models/User")
const Jobs = require("./db/models/Jobs")

const port = process.env.PORT || 8080

const app = express()

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
}))

app.use(bodyParser.json())

app.use('/public/avatar', express.static('./public/avatar'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.post("/register", upload.single("image"), async (req, res) => {
    try {
        console.log(req.body, req.file);

        // Use async/await for Cloudinary upload
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        console.log('Upload successful:', cloudinaryResponse);

        // Create a new user with the Cloudinary URL as the profile path
        const registeredUser = new User({
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio,
            profilePath: cloudinaryResponse.url 
        });

        // Generate auth token and save user
        const token = await registeredUser.generateAuthToken();
        console.log(registeredUser);
        const registered = await registeredUser.save();

        // Send response
        res.json({ jwt_token: token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error_msg: "unable to register" })
        // res.send(error);
    }
});



app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        // console.log(req.body)
        const userData = await User.findOne({ username: username })
        if (userData) {
            // res.json(userData)
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                res.json({ jwt_token: userData.token })
            } else {
                res.json({ error_msg: "invalid username or password" })
            }
        } else {
            res.json({ error_msg: "user doesn't exist" })
        }

        // res.json({jwt_token:token})
        // console.log(data)
    }
    catch (e) {
        res.json({ error_msg: "invalid login credentials" })
    }
})

app.get("/user", async (req, res) => {
    try {
        const auth = req.headers.authorization
        if (req.headers.authorization) {
            const userData = await User.findOne({ token: auth.slice(7, auth.length) })
            const { username, bio, profilePath } = userData
            res.json({ username, bio, profilePath })
        }
    }
    catch (e) {
        res.json({ error_msg: "failed to fetch user data" })

    }
})
app.get("/jobs", async (req, res) => {
    const auth = req.headers.authorization
    if (auth) {
        const data = await Jobs.find()
        res.json(data)
    }
})

app.get('/jobs/:id', async (req, res) => {
    const auth = req.headers.authorization;
    const jobId = req.params.id;
    if (auth) {
        try {
            const job = await Jobs.findOne({ 'job_details.id': jobId });
            if (job) {
                res.json(job);
            } else {
                res.status(404).json({ error: 'Job not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.listen(port, () => {
    console.log("server has started");
})