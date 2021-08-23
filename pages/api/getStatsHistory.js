export default async (req, res) => {
  let stats;

  if (req.body.historyMode === 'month') {
    stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/months`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        month: req.body.month,
        year: req.body.year,
      }),
    });
  } else if (req.body.historyMode === 'year') {
    stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/years`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        month: req.body.month,
        year: req.body.year,
      }),
    });
  } else if (req.body.historyMode === 'week') {
    stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/week`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        month: req.body.month,
        year: req.body.year,
      }),
    });
  } else if (req.body.historyMode === 'day') {
    stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/day`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        day: req.body.day,
        month: req.body.month,
        year: req.body.year,
        day2: req.body.day2,
        month2: req.body.month2,
        year2:req.body.year2,
      }),
    });
  }

  const data = await stats.json();

  // console.log(data)
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
