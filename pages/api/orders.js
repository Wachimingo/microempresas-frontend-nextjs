export default async (req, res) => {
  let records = [];
  if (req.body.role === 'admin') {
    if (req.method === 'POST') {
      records = await fetch(`http://localhost:3001/api/v1/bills/orders`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: req.body.status,
          ifValue: req.body.ifValue,
        }),
      });
    } else if (req.method === 'PATCH') {
      if (req.body.completed) {
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
              isCompleted: req.body.completed,
            }),
          }
        );
      } else if (req.body.pending) {
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
              isPending: req.body.pending,
            }),
          }
        );
      }
    } else if (req.method === 'DELETE') {
      records = await fetch(
        `http://localhost:3001/api/v1/bills/${req.body.id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );
    }
  } else if (req.body.role === 'user') {
    records = await fetch(`http://localhost:3001/api/v1/bills/ownedOrders`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: req.body.id,
        status: null,
        ifValue: null,
      }),
    });
  } else {
    console.log('ERROR');
    return;
  }

  const result = await records.json();
  // console.log(result);
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
