<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th><input type="checkbox"></th>
          <th>版本名称 <i class="fas fa-sort"></i></th>
          <th>学术搜索</th>
          <th>法律搜索</th>
          <th>标讯搜索</th>
          <th>隐藏知识库</th>
          <th>全部智能体 <i class="fas fa-sort"></i></th>
          <th>默认开启 <i class="fas fa-sort"></i></th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in versions" :key="item.id">
          <td><input type="checkbox"></td>
          <td>{{ versionTypeMap[item.type]?.name }}</td>
          <td>
            <label class="switch">
              <input type="checkbox" :checked="item.academicSearch" @change="$emit('toggle-search', item.id, 'academicSearch', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <label class="switch">
              <input type="checkbox" :checked="item.legalSearch" @change="$emit('toggle-search', item.id, 'legalSearch', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <label class="switch">
              <input type="checkbox" :checked="item.biddingSearch" @change="$emit('toggle-search', item.id, 'biddingSearch', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <label class="switch">
              <input type="checkbox" :checked="item.hideKnowledgeBase" @change="$emit('toggle-search', item.id, 'hideKnowledgeBase', $event.target.checked)">
              <span class="slider"></span>
            </label>
          </td>
          <td>
            <span class="config-link" @click="$emit('config-agents', item.id, 'available')">
              {{ item.availableAgents.length }}个智能体 <i class="fas fa-cog"></i>
            </span>
          </td>
          <td>
            <span class="config-link" @click="$emit('config-agents', item.id, 'default')">
              {{ item.defaultAgents.length }}个智能体 <i class="fas fa-cog"></i>
            </span>
          </td>
          <td>
            <div class="action-btns">
              <button class="btn btn-link" @click="$emit('edit', item.id)">
                <i class="fas fa-edit"></i> 编辑
              </button>
              <div class="dropdown">
                <button class="btn btn-link dropdown-toggle" @click="toggleDropdown(item.id)">
                  更多 <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" :class="{ show: activeDropdown === item.id }">
                  <div class="dropdown-item" @click="handleDetail(item.id)">
                    <i class="fas fa-eye"></i> 详情
                  </div>
                  <div class="dropdown-item danger" @click="handleDelete(item.id)">
                    <i class="fas fa-trash"></i> 删除
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { versionTypeMap } from '../data/agents'

defineProps({
  versions: { type: Array, default: () => [] }
})

const emit = defineEmits(['toggle-search', 'edit', 'delete', 'view-detail', 'config-agents'])

const activeDropdown = ref(null)

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const handleDetail = (id) => {
  activeDropdown.value = null
  emit('view-detail', id)
}

const handleDelete = (id) => {
  activeDropdown.value = null
  emit('delete', id)
}

const closeDropdowns = (e) => {
  if (!e.target.closest('.dropdown')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>
