export default async (req, res) => {
  const login = await fetch('http://localhost:3001/api/v1/users/signup', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    }),
  });

  const data = await login.json();

//   console.log(data)

  if (login.ok) {
    res.status(201).json({
      status: 'success',
      data: {
        data,
      },
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

// export default function handler(req, res) {
//     console.log('hola')
//     res.status(200).json({ name: 'John Doe' })
//   }
