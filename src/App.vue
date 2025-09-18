<template>
  <div class="app-container">
    <nav class="main-nav">
      <router-link to="/">首頁</router-link>
      <router-link to="/history">歷史紀錄</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// App.vue - 應用程式根組件
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'pingfang SC', 'helvetica neue', arial, 'hiragino sans gb',
    'microsoft yahei ui', 'microsoft yahei', simsun, sans-serif;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  color: #333;
  min-height: 100vh;
  margin: 0;
}

.app-container {
  min-height: 100vh;
  width: 100%;
}

.main-nav {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 30px;
  display: flex;
  justify-content: center;
  gap: 30px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.main-nav a.router-link-exact-active {
  color: #6c5ce7;
  background-color: #f0f1fe;
}

.main-nav a:hover {
    background-color: #f8f9fa;
}
</style>