import { io } from 'socket.io-client';

export default function socket() {
  const socket = io('http://localhost:8080');
  function sendMsg() {
    socket.emit('message', 'HELLO WORLD');
  }
  return <div></div>;
}
