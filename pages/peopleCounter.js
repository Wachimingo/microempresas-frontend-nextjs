import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const PoseNetComponent = dynamic(
  () => import('./../components/PoseNetComponent'),
  {
    ssr: true,
  }
);

export default function peopleCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch('/api/counter', {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((res) => setCount(res.data));
  });

  function updateCounter(counter) {
    // setCount(counter)
    console.log('excuted by timer')
    fetch('/api/counter', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        count: counter,
      }),
    }).then((res) => res.json());
  };

  return (
    <div>
      <h1>Contador en archivo {count}</h1>
      <button type="button" onClick={(e) => updateCounter(6)}>
        6
      </button>
      <PoseNetComponent updateCounter={updateCounter} />
    </div>
  );
}
