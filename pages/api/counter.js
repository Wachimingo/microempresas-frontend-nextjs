const fs = require('fs');
import path from 'path';
var newpath =
  path.join(process.cwd(), 'public/json-files/counter.json');
  console.log('path: ' + newpath)

export default (req, res) => {
  //   console.log(req.body);
  let data = JSON.parse(fs.readFileSync(newpath));
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'success',
      count: data.count,
    });
  } else if (req.method === 'POST') {
    data = req.body;
    // console.log(data)
    fs.writeFileSync(newpath, data);
    res.status(201).json({
      status: 'success',
    });
  } else {
    console.log('ERROR');
    res.status(500).json({
      status: 'error',
    });
  }
};

// export default async (req, res) => {
//   let count = ''
  
//   if(req.method === 'GET') {
//     count = await fetch(`${process.env.COUNT_BACKEND}/api/v1/counter`, {
//       method: 'GET',
//       mode: 'cors',
//     })
//   } else if(req.method === 'PATCH') {
//     // console.log(req.body)
//     count = await fetch(`${process.env.COUNT_BACKEND}/api/v1/counter/619827c2f253c90b44fdc052`, {
//       method: 'PATCH',
//       mode: 'cors',
//       body: JSON.stringify({"count": 0}),
//     })
//   } else {
//     console.log('ERROR')
//     res.status(500).json({
//       status: 'error',
//     })
//   }
//   const data = await count.json()
  
//   if(count.ok) {
//     res.status(200).json({
//       status: 'success',
//       data,
//     })
//   } else {
//     res.status(500).json({
//       status: 'error',
//     })
//   }