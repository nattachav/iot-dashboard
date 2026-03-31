const express = require("express");
const mqtt = require("mqtt");

const app = express();
const PORT = process.env.PORT || 3000;

// 👉 MQTT (HiveMQ ฟรี)
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// 👉 เก็บค่าล่าสุด
let data = {
  temp: "-",
  hum: "-",
  light: "-"
};

// ✅ connect MQTT
client.on("connect", () => {
  console.log("MQTT connected");

  client.subscribe("room/temp");
  client.subscribe("room/humidity");
  client.subscribe("room/light");
});

// ✅ รับข้อมูลจาก ESP32
client.on("message", (topic, message) => {
  const value = message.toString();

  if (topic === "room/temp") data.temp = value;
  if (topic === "room/humidity") data.hum = value;
  if (topic === "room/light") data.light = value;

  console.log(topic, value);
});

// 👉 API ให้เว็บดึงค่า
app.get("/data", (req, res) => {
  res.json(data);
});

// 👉 serve หน้าเว็บ
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
