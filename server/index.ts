import express, { Request, Response } from 'express';
import path from 'path';
import fileUpload, { UploadedFile } from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enables file upload

app.use(
  fileUpload({
    createParentPath: true,
  })
);

// importing other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

const port = process.env.PORT || 9000;

app.get('/', async (req, res) => {
  return res.send('Hello World!');
});

app.post('/upload-image', async (req: Request, res: Response) => {
  let newImage: fileUpload.UploadedFile | fileUpload.UploadedFile[];
  let uploadPath: string;
  let fileName: string;
  const currentDate: Date = new Date();
  const timeInSeconds: number = Math.round(currentDate.getTime() / 1000);

  //   image mimetypes
  const mimeType: string[] = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/JPG',
    'image/JPEG',
  ];

  if (!req.files) {
    res.send({
      status: false,
      message: 'No file was uploaded',
    });
  } else {
    // using the name of the input field to get access the file object
    newImage = req.files.image as UploadedFile;

    // check if uploaded file is supported
    if (!mimeType.includes(newImage.mimetype))
      return res.send({ status: false, message: 'Image/file not supported' });

    uploadPath = __dirname + '/uploads/' + timeInSeconds + '-' + newImage.name;
    fileName = newImage.name;
    newImage.mv(uploadPath, function (err: unknown) {
      if (err) return res.status(500).send(err);

      res.send({
        status: true,
        message: 'File uploaded!',
        filePath: `http://localhost:${port}/uploads/${timeInSeconds}-${fileName}`,
      });
    });
  }
});

// start the server
app.listen(port, () => {
  console.log(`connected successfully on http://localhost:${port}`);
});
