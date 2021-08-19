export default async (req, res) => {
  // console.log(req.body)
  const processSell = await fetch(`http://localhost:3001/api/v1/bills`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: req.headers.authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      totalPrice: req.body.totalPrice,
      totalDishes: req.body.totalDishes,
      customer: req.body.customer,
      day: req.body.day,
      isFiado: req.body.isFiado,
      status: req.body.status
    }),
  });

  const data = await processSell.json();

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
