import json
import time

import paho.mqtt.client as mqtt


BROKER_HOST = "mosquitto"
BROKER_PORT = 1883

COMMAND_TOPIC = "home/living_room/ceiling_light/set"
STATE_TOPIC = "home/living_room/ceiling_light/state"
AVAILABILITY_TOPIC = "home/living_room/ceiling_light/availability"


state = "OFF"


def publish_state(client: mqtt.Client):
    client.publish(
        STATE_TOPIC,
        state,
        qos=1,
        retain=True,
    )


def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected: {reason_code}")

    client.subscribe(
        COMMAND_TOPIC,
        qos=1,
    )

    client.publish(
        AVAILABILITY_TOPIC,
        "online",
        qos=1,
        retain=True,
    )

    publish_state(client)


def on_message(client, userdata, message):
    global state

    payload = message.payload.decode()

    print(
        f"Received: topic={message.topic} payload={payload}"
    )

    if payload not in {"ON", "OFF"}:
        print(f"Unsupported command: {payload}")
        return

    # simulate physical device execution
    time.sleep(0.3)

    state = payload

    print(f"Physical state changed → {state}")

    publish_state(client)


client = mqtt.Client(
    mqtt.CallbackAPIVersion.VERSION2,
    client_id="mqtt-lab-living-room-light",
)

client.will_set(
    AVAILABILITY_TOPIC,
    payload="offline",
    qos=1,
    retain=True,
)

client.on_connect = on_connect
client.on_message = on_message

client.connect(
    BROKER_HOST,
    BROKER_PORT,
)

client.loop_forever()