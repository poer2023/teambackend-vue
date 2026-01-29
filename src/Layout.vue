<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
      <Header />
      <div class="tabs">
        <router-link to="/" class="tab">首页</router-link>
        <router-link to="/" class="tab">团队列表</router-link>
        <router-link to="/version" class="tab" :class="{ active: $route.path === '/version' }">创作项目管理</router-link>
        <router-link to="/team-edit" class="tab" :class="{ active: $route.path === '/team-edit' }">团队信息编辑</router-link>
      </div>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
</script>

<style>
@import './styles/main.css';

.tab {
  text-decoration: none;
  color: #666;
}

.tab:hover {
  color: #1890ff;
}

.tab.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}
</style>
