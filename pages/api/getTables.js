export default async (req, res) => {
    let records = ''
  if (req.body.type === 'grupal') {
     records = await fetch(
      `http://localhost:3001/api/v1/bills?limit=${req.body.limit}&page=${req.body.page}&sort=${req.body.sort}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
  } else if (req.body.type === 'individual') {
     records = await fetch(
      `http://localhost:3001/api/v1/bills/detailedBilling?limit=${req.body.limit}&page=${req.body.page}&sort=${req.body.sort}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
  } else if (req.body.type === 'stats') {
    records = await fetch(
      `http://localhost:3001/api/v1/bills/detailedBilling?limit=${req.body.limit}&page=${req.body.page}&sort=${req.body.sort}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
  }

  const result = await records.json();
  // console.log(result)
  if (records.ok) {
    res.status(201).json({
      status: 'success',
      data: {
        result,
      },
    });
  } else {
    res.status(401).json({
      status: 'failed',
      data: {
        message: result.message[0].message,
      },
    });
  }
};
