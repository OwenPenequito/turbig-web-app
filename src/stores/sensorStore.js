import { defineStore } from "pinia";

export const useSensorStore = defineStore("sensorStore", {
  state: () => ({
    turbidity: null,
    alerts: [],
  }),
  actions: {
    handleIncomingData({ topic, message }) {
      if (topic === "sensors/turbidity") {
        this.turbidity = parseFloat(message); 
        this.checkTurbidityAlerts(this.turbidity);
      }
    },
    checkTurbidityAlerts(turbidity) {
      this.clearAlerts();

      if (turbidity <= 5) {
        this.addAlert("Clear water", "green", "Water is clean. No action required.");
      } else if (turbidity > 5 && turbidity <= 50) {
        this.addAlert("Slightly cloudy water", "yellow", "Monitor the water quality. Consider mild filtration if necessary.");
      } else if (turbidity > 50 && turbidity <= 500) {
        this.addAlert("Cloudy water with suspended particles", "orange", "Water may need filtration or sedimentation treatment.");
      } else if (turbidity > 500) {
        this.addAlert("Very turbid water", "red", "Immediate action required: filtration and sedimentation recommended.");
      }
    },
    addAlert(message, backgroundColor, recommendation) {
      const textColor = backgroundColor === "yellow" ? "black" : "white";
      this.alerts.push({ message, color: backgroundColor, textColor, recommendation });
    },
    clearAlerts() {
      this.alerts = [];
    },
  },
  getters: {
    getLatestTurbidity: (state) => state.turbidity,
    getAlerts: (state) => state.alerts,
  },
});
