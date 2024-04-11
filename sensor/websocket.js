const socket = new WebSocket('ws://0.0.0.0:8765');

socket.addEventListener('open', (event) => {
  console.log('WebSocket connection opened');

  // Send a message to request the value of x
  socket.send('get_x');
});

socket.addEventListener('message', (event) => {
  const xValue = event.data;
  console.log('Received x:', xValue);
});

socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed:', event);
});