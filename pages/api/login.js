export default async (req, res) => {
  const login = await fetch('http://localhost:3001/api/v1/users/login', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: req.body.email,
      password: req.body.password,
    }),
  });

  const data = await login.json();
  data.user.token = data.token

  // console.log(data)

  if (login.ok) {
    res.status(201).json({
      status: 'success',
      data: {
        user: data.user,
      }
    });
  } else {
    res.status(401).json({
        status: 'failed',
        data: {
          message: data.message[0].message
        },
      });
  }
};

// export default function handler(req, res) {
//     console.log('hola')
//     res.status(200).json({ name: 'John Doe' })
//   }