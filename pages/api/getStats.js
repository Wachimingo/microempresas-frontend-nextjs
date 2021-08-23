export default async (req, res) => {
  const stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${req.body.token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      mode: req.body.mode,
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
    }),
  });

  const data = await stats.json();
  if (stats.ok) {
    res.status(200).json({
      status: 'success',
      data: data.data,
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        message: data.message,
      },
    });
  }
};
