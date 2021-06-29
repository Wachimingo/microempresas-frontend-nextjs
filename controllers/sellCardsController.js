const toast = 'react-toastify';
const notify = (text) => toast(text);
let dishIds = new Set();
let counterDish = 0;
let counterPrice = 0;
let Today_date = new Date();
let day = Today_date.getDay();
const week = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
];
localStorage.setItem('counterDish', 0);
localStorage.setItem('counterPrice', 0);

exports.upCounter = (id, price) => {
  dishIds.add(id);
  counterDish = counterDish * 1 + 1;
  counterPrice = counterPrice * 1 + price;
  // Up the number in the label of total amount in a single dish
  document.getElementById(id).innerHTML =
    document.getElementById(id).innerHTML * 1 + 1;
  // Up the number in the label of total dishes
  document.getElementById('totalDishes').innerHTML =
    document.getElementById('totalDishes').innerHTML * 1 + 1;
  // Up the number in the label of total price
  document.getElementById('totalPrice').innerHTML =
    document.getElementById('totalPrice').innerHTML * 1 + price;
  // Set the number in localStorage so the fetch function to create the bill can work properly, if other method is used it will only call the first fetch
  localStorage.setItem('counterDish', counterDish);
  localStorage.setItem('counterPrice', counterPrice);
  // console.log(localStorage.getItem('counterDish'), localStorage.getItem('counterPrice'))
};

exports.lowerCounter = (id, price) => {
  //Validating the amount to avoid going to negative numbers
  if (document.getElementById(id).innerHTML > 0) {
    // lower the number in the label of total amount in a single dish
    document.getElementById(id).innerHTML =
      document.getElementById(id).innerHTML * 1 - 1;
    // lower the number in the label of total dishes
    document.getElementById('totalDishes').innerHTML =
      document.getElementById('totalDishes').innerHTML * 1 - 1;
    // lower the number in the label of total price
    document.getElementById('totalPrice').innerHTML =
      document.getElementById('totalPrice').innerHTML * 1 - price;
    counterDish = counterDish * 1 - 1;
    counterPrice = counterPrice * 1 - price;
    localStorage.setItem('counterDish', counterDish);
    localStorage.setItem('counterPrice', counterPrice);
    // console.log(localStorage.getItem('counterDish'), localStorage.getItem('counterPrice'))
  } else {
    dishIds.delete(id);
    document.getElementById(id).innerHTML = 0;
    localStorage.setItem('counterDish', 0);
    localStorage.setItem('counterPrice', 0);
  }
};

addDishesToBill = (billId, token) => {
  for (let id of dishIds) {
    for (let i = 0; i < document.getElementById(id).innerHTML * 1; i++) {
      fetch(`/api/addDishesToBill`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bill: billId,
          dish: id,
          amount: document.getElementById(id).innerHTML,
          day: week[day],
        }),
      }).then((res) => res.json());
      // .then((res) => console.log(res));}
    }
    // notify('Factura creada!');
    // location.reload();
  }}

  exports.processSell = (fiado, token) => {
    if (localStorage.getItem('counterDish') * 1 > 0) {
      fetch(`/api/processSell`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalPrice: localStorage.getItem('counterPrice'),
          totalDishes: localStorage.getItem('counterDish'),
          day: week[day],
          isFiado: fiado,
        }),
      })
        .then((res) => res.json())
        // .then((res)=>console.log(res))
        .then((res) => addDishesToBill(res.data.result.data.data._id, token));
    }
  };
