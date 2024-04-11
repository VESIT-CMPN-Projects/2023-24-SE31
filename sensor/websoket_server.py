import asyncio
import websockets
import random
import socket

# Generate a big random value for variable x
x = random.randint(1000000, 9999999)

async def handle_connection(websocket, path):
    global x

    try:
        while True:
            # Wait for a message from the client
            message = await websocket.recv()

            if message == "get_x":
                # Send the current value of x when the client requests it
                await websocket.send(str(x))
            else:
                print(f"Received unknown message: {message}")

    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")

if __name__ == "__main__":
    # Get the local IP address of the hosting device
    server_address = socket.gethostbyname(socket.gethostname())
    server_port = 8765

    # Start the WebSocket server
    start_server = websockets.serve(handle_connection, server_address, server_port)

    print(f"WebSocket server started at ws://{server_address}:{server_port}")

    # Run the event loop
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
