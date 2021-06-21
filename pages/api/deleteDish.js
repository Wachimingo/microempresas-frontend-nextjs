import path from 'path';
import fs from 'fs';

export default async (req, res) => {
  var filePath =
    path.join(`${__dirname}/../../../../`, 'public') +
    '/dishes/' +
    req.body.fileName;

  const deleteDish = await fetch(
    `http://192.168.1.2:3001/api/v1/menu/${req.body.id}`,
    {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`,
      },
    }
  );

    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
    res.status(200).json({
      status: 'success',
      data: {
        message: 'successful',
        data: null
      },
    });
};
