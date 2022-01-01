import express, { Request, Response } from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'

const app = express()

// Enables file upload

app.use(
    fileUpload({
        createParentPath: true,
    })
)

// importing other middleware
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

const port = process.env.PORT || 9000

app.get('/', async (req, res) => {
    return res.send('Hello World!')
})

app.post('/upload-image', async (req: Request, res: Response) => {
    let newImage
    let uploadPath

    if (!req.files) {
        res.send({
            status: false,
            message: 'No file was uploaded',
        })
    } else {
        // using the name of the input field to get access the file object
        newImage = req.files.image
        uploadPath = __dirname + './uploads' + newImage.name
        newImage.mv(uploadPath)
    }
})

// start the server
app.listen(port, () => {
    console.log(`connected successfully on http://localhost:${port}`)
})
