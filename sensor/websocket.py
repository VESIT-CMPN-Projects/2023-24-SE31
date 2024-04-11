import asyncio
import websockets
import csv
import json
import requests
import random

def get_external_ip():
    try:
        response = requests.get('https://api64.ipify.org?format=json')
        if response.status_code == 200:
            ip_address = response.json()['ip']
            return ip_address
        else:
            print(f"Failed to get IP address. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error getting IP address: {e}")

    return None

def getIP():
    ip_address = get_external_ip()

    with open("websocket_ip.txt", "w") as file:
        file.write(ip_address)

    return ip_address

def read_initial_values():
    with open("dummy.csv", "r") as file:
        reader = csv.DictReader(file)
        rows = list(reader)
    random_values = {}
    for attribute in reader.fieldnames:
        random_values[attribute] = random.choice([row[attribute] for row in rows])

    return random_values

async def websocket_server(websocket, path):
    print("WebSocket connection established.")
    initial_values = read_initial_values()

    await websocket.send(json.dumps({"type": "initial", "data": initial_values}))

    try:
        while True:
            await asyncio.sleep(10)

            final_values = [update_logic(attribute) for attribute in initial_values]

            await websocket.send(json.dumps({"type": "update", "data": final_values}))

    except websockets.exceptions.ConnectionClosed:
        print("WebSocket connection closed.")

def update_logic(attribute):
    
    return attribute

if __name__ == "__main__":
    # for now this is not needed
    # ip_address = getIP()
    ip_address = True
    if ip_address:
        # print(f"Server IP address: {ip_address}")
        start_server = websockets.serve(websocket_server, '0.0.0.0', 8767)

        print("Before event loop")
        asyncio.get_event_loop().run_until_complete(start_server)
        print("After event loop")

        try:
            asyncio.get_event_loop().run_forever()
        except KeyboardInterrupt:
            pass
        finally:
            print("Closing the event loop.")
            asyncio.get_event_loop().close()

    else:
        print("Failed to obtain IP address.")
