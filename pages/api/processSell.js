export default async (req, res) => {
  // console.log(req.body.customer)
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
      isPending: req.body.pending
    }),
  });

  const result = await processSell.json();

  if (processSell.ok) {
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
        message: result.message,
      },
    });
  }
};
