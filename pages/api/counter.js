// const fs = require('fs');
// import path from 'path';
// var newpath =
//   path.join(`${__dirname}/../../../../`, 'json-files') + '/counter.json';

// export default (req, res) => {
//   //   console.log(req.body);
//   let data = JSON.parse(fs.readFileSync(newpath));
//   if (req.method === 'GET') {
//     res.status(200).json({
//       status: 'success',
//       count: data.count,
//     });
//   } else if (req.method === 'POST') {
//     data = req.body;
//     // console.log(data)
//     fs.writeFileSync(newpath, data);
//     res.status(201).json({
//       status: 'success',
//     });
//   } else {
//     console.log('ERROR');
//   }
// };

export default async (req, res) => {
  let data = ''
  
  if(req.method === 'GET') {

    data = await fetch(`${process.env.COUNT_BACKEND}/api/v1/counter`, {
      method: 'GET',
      mode: 'cors',
    })
  } else if(req.method === 'PATCH') {
    data = await fetch(`${process.env.COUNT_BACKEND}/api/v1/counter/619827c2f253c90b44fdc052`, {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify(req.body),
    })
  } else {
    console.log('ERROR')
    res.status(500).json({
      status: 'error',
    })
  }
  const count = await data.json()

  if(data.ok) {
    res.status(200).json({
      status: 'success',
      count,
    })
  } else {
    res.status(500).json({
      status: 'error',
    })
  }
}