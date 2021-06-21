export default async (req, res) => {
  // console.log(req.body);

  const updateDish = await fetch(
    `http://localhost:3001/api/v1/menu/${req.body.id}`,
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        forToday: req.body.forToday,
      }),
    }
  );

  const result = await updateDish.json();

  if (updateDish.ok) {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'successful',
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
