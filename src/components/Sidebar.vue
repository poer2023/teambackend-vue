<template>
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-icon">
        <i class="fas fa-cube"></i>
      </div>
      <span class="logo-text">万能小in管理平台</span>
    </div>
    <nav class="menu">
      <div class="menu-item">
        <i class="fas fa-th-large"></i>
        <span>dashboard</span>
        <i class="fas fa-chevron-down arrow"></i>
      </div>
      <div class="menu-item">
        <i class="fas fa-chart-bar"></i>
        <span>数据看板</span>
        <i class="fas fa-chevron-down arrow"></i>
      </div>
      <div class="menu-item expanded" @click="teamMenuOpen = !teamMenuOpen">
        <i class="fas fa-users"></i>
        <span>团队版</span>
        <i class="fas arrow" :class="teamMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>
      <div class="submenu" v-show="teamMenuOpen">
        <router-link to="/team-edit" class="menu-item sub" :class="{ active: $route.path === '/team-edit' }">
          <i class="fas fa-list"></i>
          <span>团队信息编辑</span>
        </router-link>
        <router-link to="/version" class="menu-item sub" :class="{ active: $route.path === '/version' }">
          <i class="fas fa-code-branch"></i>
          <span>版本管理</span>
        </router-link>
      </div>
      <div class="menu-item">
        <i class="fas fa-cog"></i>
        <span>系统管理</span>
        <i class="fas fa-chevron-down arrow"></i>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const teamMenuOpen = ref(true)
</script>

<style scoped>
.menu-item.sub {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  align-items: center;
  padding: 12px 16px;
  padding-left: 48px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item.sub:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.menu-item.sub.active {
  background: #1890ff;
  color: #fff;
}
</style>
