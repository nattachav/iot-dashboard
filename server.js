const express = require("express");
const mqtt = require("mqtt");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- MQTT ----------
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

let data = {
  temp: "-",
  hum: "-",
  light: "-"
};

client.on("connect", () => {
  console.log("✅ MQTT connected");

  client.subscribe("room/temp");
  client.subscribe("room/humidity");
  client.subscribe("room/light");
});

client.on("message", (topic, message) => {
  const value = message.toString();

  console.log("📩", topic, value);

  if (topic === "room/temp") data.temp = value;
  if (topic === "room/humidity") data.hum = value;
  if (topic === "room/light") data.light = value;
});

// ---------- API ----------
app.get("/data", (req, res) => {
  res.json(data);
});

// ---------- Static Web ----------
app.use(express.static("public"));

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
