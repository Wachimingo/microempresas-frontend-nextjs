export default async (req, res) => {
    // console.log(req.query)
    const processSell = await fetch(`${process.env.backend_nodejs}/api/v1/users/getBalance/${req.query.id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: req.headers.authorization,
      },
    });
  
    const data = await processSell.json();
  
    // console.log(data)
  
    if (processSell.ok) {
      res.status(201).json({
        status: 'success',
        data
      });
    } else {
      res.status(401).json({
        status: 'failed',
        data: {
          message: data.message,
        },
      });
    }
  };
  