import mqtt from "mqtt";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyBcufzKJNeYgCBWz93RzPz3-Py92AVGrtw",
  authDomain: "turbig-a6d5e.firebaseapp.com",
  databaseURL: "https://turbig-a6d5e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "turbig-a6d5e",
  storageBucket: "turbig-a6d5e.firebasestorage.app",
  messagingSenderId: "929120175652",
  appId: "1:929120175652:web:2b13b241530b014e09bab1",
  measurementId: "G-8Q95P24KVG"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const sensorDataCollection = collection(db, "sensorData");

// MQTT Client Setup
let client = null;

// MQTT Connection
export const connectMQTT = (brokerUrl, options) => {
  client = mqtt.connect(brokerUrl, options);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
  });

  client.on("error", (err) => {
    console.error("MQTT connection error:", err);
  });

  client.on("close", () => {
    console.log("Connection closed. Reconnecting...");
    setTimeout(() => connectMQTT(brokerUrl, options), 5000);
  });
};

// Subscribe and Handle Messages
export const subscribeToTopic = (topics, callbacks) => {
  if (client) {
    topics.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic ${topic}:`, err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    client.on("message", async (topic, message) => {
      const messageStr = message.toString();
      console.log(`Received message: ${messageStr} on topic: ${topic}`);


      try {
        await addDoc(sensorDataCollection, {
          topic,
          message: messageStr,
          timestamp: new Date()
        });
        console.log("Message saved to Firebase");
      } catch (err) {
        console.error("Failed to save message to Firebase:", err);
      }


      if (callbacks[topic]) {
        callbacks[topic](messageStr);
      }
    });
  }
};


const brokerUrl = "wss://f432e6b5b85443cea1d4f7085449df2c.s1.eu.hivemq.cloud:8884/mqtt"; 
const mqttOptions = {
  username: "turbidity123",
  password: "Jinlorie123456",
  clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`
};

connectMQTT(brokerUrl, mqttOptions);

subscribeToTopic(["/sensor/turbidity"], {
  "/sensor/turbidity": (message) => {
    console.log(`Processing turbidity data: ${message}`);
  }
});
