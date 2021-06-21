import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
const sharp = require('sharp');

//set bodyparser
export const config = {
  api: {
    uploadDir: './public',
    bodyParser: false,
  },
};

export default async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    // console.log(path.join(`${__dirname}/../../../../`, 'public/'))
    const form = new formidable({
      uploadDir: path.join(`${__dirname}/../../../../`, 'public'),
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });

  let fileName = `dish-${data.files.image.name}-${Date.now()}.jpeg`;

  const addDish = await fetch('http://localhost:3001/api/v1/menu', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${req.headers.authorization}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.fields.name,
      description: data.fields.description,
      price: data.fields.price,
      forToday: data.fields.forToday,
      image: fileName,
    }),
  });

  const result = await addDish.json();

  if (addDish.ok) {
    var oldpath = data.files.image.path;

    var newpath =
      path.join(`${__dirname}/../../../../`, 'public') + '/dishes/' + fileName;

    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });

    // sharp(newpath)
    //   .resize(500, 500)
    //   .toFormat('jpeg')
    //   .jpeg({ quality: 90 })
    //   .toFile(newpath);

    res.status(201).json({
      status: 'success',
      data: {
        result,
      },
    });
  } else {
    fs.unlink(data.files.image.path, (err) => {
      if (err) {
        throw err;
      }
      // console.log('File deleted')
    });
    res.status(401).json({
      status: 'failed',
      data: {
        message: result.message,
      },
    });
    //   console.log(data)
  }
};
