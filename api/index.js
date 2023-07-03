require("dotenv").config()
const downloader = require("image-downloader")
const multer = require("multer")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { default: mongoose } = require("mongoose")
const fs = require("fs")
const User = require("./models/User")
const Place = require("./models/Place")
const Booking = require("./models/Booking")

const app = express()

app.use(bodyParser.json())
app.use(express.json())
app.use(require("cookie-parser")())
app.use(
  cors({
    credentials: true,
    origin: ["http://66.42.40.163:5174", "http://66.42.40.163:5173"],
  })
)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => {
    console.error(err)
  })

app.get("/test", (_req, res) => {
  console.log("called /test")
  res.json("test ok")
})

const salt = bcrypt.genSaltSync(10)
const secret = "jsdkflljfsdk"

app.post("/register", async (req, res) => {
  console.log(req.body)
  const { name, email, password } = req.body
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, salt),
    })
    res.json(userDoc)
  } catch (error) {
    res.status(422).json(error)
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  console.log(email)
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
      console.log(passOk)
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        secret,
        {},
        (err, token) => {
          if (err) throw err
          console.log("userDoc /login ", userDoc)
          res.cookie("token", token).json(userDoc)
        }
      )
    } else {
      res.status(422).json("password not Ok")
    }
  } else {
    res.json("Not found")
  }
})

app.get("/profile", (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) throw err
      // console.log(userData)
      const { name, email, _id } = await User.findById(userData.id)
      // console.log({ name, email, _id })
      res.json({ name, email, _id })
    })
  } else {
    res.json(null)
  }
})

app.post("/logout", (_req, res) => {
  console.log("logout")
  res.cookie("token", "").json(true)
})

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body
  console.log(link)
  const newName = "photo" + Date.now() + ".jpg"
  await downloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  })
  res.json(newName)
})

app.use("/uploads", express.static(__dirname + "/uploads"))

const uploadMulter = multer({ dest: "uploads/" })
app.post("/upload", uploadMulter.array("photos", 100), (req, res) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const { filename, originalname, destination } = req.files[i]
    const parts = originalname.split(".")
    const ext = parts[parts.length - 1]
    const newName = filename + "." + ext
    console.log(newName)
    fs.renameSync(
      __dirname + "/" + destination + "/" + filename,
      __dirname + "/" + destination + "/" + newName
    )

    uploadedFiles.push(newName)
  }
  console.log(uploadedFiles)
  res.json(uploadedFiles)
})

app.post("/places", (req, res) => {
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body

  const { token } = req.cookies
  if (token) {
    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) throw err
      const placeData = await Place.create({
        owner: userData.id,
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      })
      res.json(placeData)
    })
  }
})

app.get("/places", (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, secret, {}, async (err, userData) => {
    if (err) throw err
    const { id } = userData
    res.json(await Place.find({ owner: id }))
  })
})

app.get("/places/:id", async (req, res) => {
  const { id } = req.params
  const placeDoc = await Place.findById(id)
  res.json(placeDoc)
})

app.put("/places", async (req, res) => {
  const {
    id,
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body

  console.log(id, title, address, description)
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) throw err
      const placeDoc = await Place.findById(id)
      console.log(placeDoc.owner)
      console.log(userData.id)
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,
          address,
          photos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        })
        await placeDoc.save()
        res.json("ok")
      }
    })
  }
})

app.get("/all-places", async (_req, res) => {
  res.json(await Place.find())
})

function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, secret, {}, async (err, userData) => {
      if (err) reject(err)
      resolve(userData)
    })
  })
}

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req)
  const { place, checkIn, checkOut, numberOfGuest, name, phone, price } =
    req.body

  Booking.create({
    place,
    user: userData.id,
    checkIn,
    checkOut,
    numberOfGuest,
    name,
    phone,
    price,
  })
    .then((doc) => {
      res.json(doc)
    })
    .catch((err) => {
      throw err
    })
})

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req)
  res.json(await Booking.find({ user: userData.id }).populate("place"))
})

app.listen(4000, () => console.log("listening on port 4000"))
