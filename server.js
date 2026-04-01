const express = require("express");
const mqtt = require("mqtt");

const app = express();
const PORT = process.env.PORT || 3000;

const client = mqtt.connect("mqtt://broker.hivemq.com:1883", {
  reconnectPeriod: 1000,
});

let data = {
  temp: "-",
  hum: "-",
  light: "-",
  button: "-"
};

client.on("connect", () => {
  console.log("MQTT connected");

  client.subscribe("room/temp");
  client.subscribe("room/humidity");
  client.subscribe("room/light");
  client.subscribe("room/button");
});

client.on("message", (topic, message) => {
  const value = message.toString();

  if (topic === "room/temp") data.temp = value;
  if (topic === "room/humidity") data.hum = value;
  if (topic === "room/light") data.light = value;
  if (topic === "room/button") data.button = value;

  console.log(topic, value);
});

app.get("/data", (req, res) => {
  res.json(data);
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server running");
});