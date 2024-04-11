import csv
import asyncio
import websockets
import random
import socket
import json
import threading
import time

indices = {
    "N": 0,
    "P": 1,
    "K": 2,
    "temperatureA": 3,
    "humidity": 4,
    "ph": 5,
}

data = []

with open("data.csv", "r") as csvfile:
    csvreader = csv.reader(csvfile)
    headers = next(csvreader)  # Assuming the first row contains headers

    for row in csvreader:
        data.append([float(i) for i in row])

initial = 0
final = 1
T = 20
current = 0

connected_clients = set()


def wobbly():
    return current + random.random() * 0.3 - 0.05


async def handle_connection(websocket, path):
    global data, initial, final, T, current, indices, connected_clients

    try:
        connected_clients.add(websocket)
        while True:
            # Wait for a message from the client
            data1 = data[initial]
            data2 = data[final]
            dataN = [
                data1[i] * wobbly() / T + data2[i] * (T - wobbly()) / T
                for i in range(len(indices.keys()))
            ]
            await websocket.send(json.dumps(dataN))
            current += 1
            if current == T:
                current = 0
                final = initial
                initial = (initial + 1) % len(data)
            await asyncio.sleep(0.5)

    except websockets.exceptions.ConnectionClosedOK as e:
        print(f"Connection closed gracefully: {e}")
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed unexpectedly: {e}")

    finally:
        connected_clients.remove(websocket)


async def check_clients():
    global connected_clients

    while True:
        # Iterate over a copy of the set to avoid modification during iteration
        for websocket in connected_clients.copy():
            try:
                # Send a ping to check if the connection is still alive
                await asyncio.wait_for(websocket.ping(), timeout=60)
            except asyncio.TimeoutError:
                # If the ping times out, close the connection
                print("Closing connection due to timeout")
                await websocket.close()
                connected_clients.remove(websocket)

        await asyncio.sleep(20)


if __name__ == "__main__":
    # Get the local IP address of the hosting device
    server_address = "0.0.0.0"
    server_port = 8765

    # Start the WebSocket server
    start_server = websockets.serve(handle_connection, server_address, server_port)

    print(f"WebSocket server started at ws://{server_address}:{server_port}")

    # Run the event loop
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_until_complete(check_clients())
    asyncio.get_event_loop().run_forever()
