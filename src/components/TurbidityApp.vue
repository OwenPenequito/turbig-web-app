<template>
  <div class="sensor-container">
    <div class="sensor-card">
      <h1>Sensor 1: Real-Time Turbidity Data</h1>

      <div class="data-section">
        <div class="data-item">
          <strong>Turbidity:</strong> {{ latestTurbidity }} NTU
        </div>
      </div>

      <div class="alert-section">
        <div
          v-for="alert in alerts"
          :key="alert.message"
          :style="{ backgroundColor: alert.color || 'gray', color: alert.textColor || 'white' }"
          class="alert"
        >
          <strong>{{ alert.message }}</strong>
          <div class="recommendation">{{ alert.recommendation }}</div>
        </div>
      </div>

      <div class="chart-section">
        <h2>Turbidity History</h2>
        <apexchart type="line" :options="chartOptions" :series="chartSeries" />
      </div>
    </div>
  </div>
</template>

<script>
import { connectMQTT, subscribeToTopic } from "@/services/mqttService";
import { useSensorStore } from "@/stores/sensorStore";
import { storeToRefs } from "pinia";
import VueApexCharts from "vue3-apexcharts";
import { reactive } from "vue";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const sensorStore = useSensorStore();
    const { alerts } = storeToRefs(sensorStore);

    const chartSeries = reactive([
      {
        name: "Turbidity (NTU)",
        data: [],
      },
    ]);

    const chartOptions = reactive({
      chart: {
        type: "line",
        height: 350,
        toolbar: {
          show: true,
        },
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 1000,
          },
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
        },
      },
      yaxis: {
        title: {
          text: "Turbidity (NTU)",
        },
        labels: {
          formatter: (value) => `${value.toFixed(1)} NTU`,
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      markers: {
        size: 4,
        colors: ["#FFA500"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      title: {
        text: "Turbidity Readings Over Time",
        align: "center",
      },
    });

    const brokerUrl = "wss://f432e6b5b85443cea1d4f7085449df2c.s1.eu.hivemq.cloud:8884/mqtt";
    const options = {
      username: "turbidity123",
      password: "Jinlorie123456",
      keepalive: 60,
      reconnectPeriod: 1000,
    };

    connectMQTT(brokerUrl, options);

    const topics = ["sensors/turbidity"];
    const callbacks = {
      "sensors/turbidity": (message) => {
        const turbidityData = parseFloat(message);
        if (!isNaN(turbidityData)) {
          sensorStore.handleIncomingData({
            topic: "sensors/turbidity",
            message: turbidityData,
          });

          updateChartData(turbidityData);
        }
      },
    };

    subscribeToTopic(topics, callbacks);

    const updateChartData = (turbidityData) => {
      const timestamp = new Date().getTime();

      chartSeries[0].data.push([timestamp, turbidityData]);

      if (chartSeries[0].data.length > 50) {
        chartSeries[0].data.shift();
      }
    };

    return {
      alerts,
      chartSeries,
      chartOptions,
    };
  },
  computed: {
    latestTurbidity() {
      const sensorStore = useSensorStore();
      return sensorStore.getLatestTurbidity || "N/A";
    },
  },
};
</script>

<style scoped>
.sensor-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0);
  padding: 20px;
}

.sensor-card {
  background: rgba(255, 255, 255, 0.741);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.data-section {
  margin-bottom: 20px;
}

.alert-section {
  margin-bottom: 20px;
}

.alert {
  padding: 10px;
  border-radius: 5px;
  margin: 5px 0;
  font-weight: bold;
}

.recommendation {
  font-size: 0.9em;
  margin-top: 5px;
}

.chart-section {
  margin-top: 20px;
}

h1,
h2 {
  margin: 10px 0;
  font-family: Arial, sans-serif;
}
</style>
