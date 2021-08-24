export default async (req, res) => {
  let records = [];
  // console.log(req.body.url)
  if (req.body.role === 'admin') {
    if (req.method === 'POST') {
      records = await fetch(`${req.body.url}/api/v1/bills/orders`, {
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
      records = await fetch(
        `${req.body.url}/api/v1/bills/${req.body.id}`,
        {
          method: 'PATCH',
          mode: 'cors',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: req.body.status,
          }),
        }
      );
    } else if (req.method === 'DELETE') {
      records = await fetch(
        `${req.body.url}/api/v1/bills/${req.body.id}`,
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
    // console.log(req.body)
    records = await fetch(`${req.body.url}/api/v1/bills/ownedOrders?sort=-status`, {
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

  const data = await records.json();
  // console.log(data);
  if (records.ok) {
    res.status(201).json({
      status: 'success',
      data,
    });
  } else {
    res.status(401).json({
      status: 'failed',
      data: {
        message: data.message[0].message,
      },
    });
  }
};
