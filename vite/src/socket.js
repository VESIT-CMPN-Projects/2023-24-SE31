let socket;

let value = {
    "N": Array(100).fill(0).map(v => .33),
    "P": Array(100).fill(0).map(v => .33),
    "K": Array(100).fill(0).map(v => .34),
    "temperatureA": Array(100).fill(0).map(v => 30 + Math.random() * 1 - 0.5),
    "humidity": Array(100).fill(0).map(v => 30 + Math.random() * 1 - 0.5),
    "ph": Array(100).fill(0).map(v => 7 + Math.random() * 0.1 - 0.05),
    "pesticides_tonnes": Array(100).fill(0).map(v => 30 + Math.random() * 1 - 0.5),
    "temperatureB": Array(100).fill(0).map(v => 30 + Math.random() * 1 - 0.5),
    "market": Array(100).fill(0).map(v => 2000 + Math.random() * 10 - 5),
}

export let initSocket = () => {
    socket = new WebSocket("ws://0.0.0.0:8765");

    socket.addEventListener("open", e => {
        console.log("Socket joined, yay!");
    });

    socket.addEventListener("message", ({ data }) => {
        let values = JSON.parse(data);
        for (let i = 0; i < values.length; i++)
            push(value[Object.keys(value)[i]], values[i])
    });

    socket.addEventListener('close', (event) => {
        console.log("Connection closed")
    });
}

export let onRecv = fn => {
    socket.addEventListener("message", fn);
}

export function peek(key) {
    return value[key];
}

export function push(arr, value) {
    arr.shift();
    arr.push(value)
}