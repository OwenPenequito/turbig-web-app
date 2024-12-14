import { createRouter, createWebHistory } from "vue-router";
import TurbidityApp1 from "@/components/TurbidityApp.vue";
import TurbidityApp2 from "@/components/TurbidityApp2.vue";

const routes = [
  {
    path: "/",
    redirect: "/sensor1",
  },
  {
    path: "/sensor1",
    name: "Sensor1",
    component: TurbidityApp1,
  },
  {
    path: "/sensor2",
    name: "Sensor2",
    component: TurbidityApp2,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
