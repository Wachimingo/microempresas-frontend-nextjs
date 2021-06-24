// import { toast } from 'react-toastify';
// const notify = (text) => toast(text);

exports.deleteDish = (id, i, fileName, token) => {
  fetch(`/api/deleteDish`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      fileName,
    }),
  });
  document.getElementById(i).className = 'd-none';
  // location.reload();
  // notify('Se ha borrado el platillo');
};

exports.setDishForToday = (id, forToday, token) => {
  fetch(`/api/setDishForToday`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      forToday,
    }),
  })
    .then((res) => res.json())
    .then(() => location.reload());
  //   notify('Platillo selecionado para hoy!');
};