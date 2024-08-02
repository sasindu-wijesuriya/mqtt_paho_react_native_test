import Paho from "paho-mqtt";

import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Button, View, TextInput } from "react-native";

client = new Paho.Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

export default function App() {
  const [textBoxValue, setTextBoxValue] = useState("");
  const [mqttTopic, setMqttTopic] = useState("sasinduwije1");
  const [mqttMessage, setMqttMessage] = useState("");

  function onMessage(message) {
    if (message.destinationName === mqttTopic)
      setTextBoxValue(message.payloadString);
  }

  useEffect(() => {
    client.connect({
      onSuccess: () => {
        console.log("Connected!");
        client.subscribe("sasinduwije1");
        client.onMessageArrived = onMessage;
      },
      onFailure: () => {
        console.log("Failed to connect!");
      },
    });
  }, []);

  function sendMqttMessageHandler(c) {
    const message = new Paho.Message(mqttMessage);
    message.destinationName = mqttTopic;
    c.send(message);
    console.log("Message: ", mqttMessage, " sent to ", mqttTopic);
    setMqttMessage("");
  }

  return (
    <View style={styles.container}>
      <Text>MQTT Topic : {mqttTopic}</Text>
      <Text>Current value in MQTT is: {textBoxValue}</Text>
      <TextInput
        style={{
          height: 40,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(text) => setMqttMessage(text)}
        value={mqttMessage}
      />
      <Button
        onPress={() => {
          sendMqttMessageHandler(client);
        }}
        title="Send Mqtt message"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
