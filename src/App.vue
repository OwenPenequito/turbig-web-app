<template>
  <div id="app">
    <nav class="navigation">
      <router-link to="/sensor1" class="nav-link">Sensor 1</router-link>
      <router-link to="/sensor2" class="nav-link">Sensor 2</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  background: linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ),
    url('@/assets/weather.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
}

.navigation {
  position: fixed;
  top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

router-view {
  flex: 1;
  width: 100%;
}
</style>
