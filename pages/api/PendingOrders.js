export default async (req, res) => {
  let records = [];
  if (req.method === 'GET') {
    records = await fetch(
      `http://localhost:3001/api/v1/bills/pendingorders/?limit=100`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
  } else if(req.method === 'PATCH') {
    records = await fetch(
      `http://localhost:3001/api/v1/bills/${req.body.id}`,
      {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPending: req.body.pending
        })
      }
    );
  } else if(req.method === 'DELETE') {
    records = await fetch(
      `http://localhost:3001/api/v1/bills/${req.body.id}`,
      {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
        }
      }
    );
  }

  const result = await records.json();
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
