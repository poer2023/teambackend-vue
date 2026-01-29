<template>
  <div class="modal" :class="{ show: visible }">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <span class="close" @click="$emit('update:visible', false)">&times;</span>
      </div>
      <div class="modal-body">
        <!-- 搜索栏 -->
        <div class="agent-search">
          <i class="fas fa-search"></i>
          <input type="text" v-model="searchText" placeholder="搜索智能体...">
        </div>

        <!-- 类别标签 -->
        <div class="category-tabs">
          <span
            v-for="cat in categories"
            :key="cat"
            class="category-tab"
            :class="{ active: currentCategory === cat }"
            @click="$emit('update:current-category', cat)"
          >
            {{ cat }} ({{ getCategoryCount(cat) }})
          </span>
        </div>

        <!-- 批量操作 -->
        <div class="agent-batch-actions">
          <button class="btn btn-primary btn-sm" @click="$emit('toggle-all', true)">
            <i class="fas fa-check-double"></i> 全部开启
          </button>
          <button class="btn btn-default btn-sm" @click="$emit('toggle-all', false)">
            <i class="fas fa-times"></i> 全部关闭
          </button>
        </div>

        <!-- 智能体列表 -->
        <div class="agent-list-container">
          <table class="agent-table">
            <thead>
              <tr>
                <th style="width: 60px;">序号</th>
                <th>智能体</th>
                <th style="width: 100px;">类别</th>
                <th style="width: 120px;">状态(是否可见)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="agent in filteredAgents" :key="agent.id" class="agent-row">
                <td>
                  <input
                    v-if="config[agent.id]?.enabled"
                    type="number"
                    class="order-input"
                    :value="config[agent.id]?.order"
                    min="1"
                    @change="$emit('update-order', agent.id, $event.target.value)"
                  >
                  <span v-else class="order-placeholder">-</span>
                </td>
                <td>
                  <div class="agent-info">
                    <div class="agent-icon" :class="agent.color">
                      <i class="fas" :class="agent.icon"></i>
                    </div>
                    <div class="agent-details">
                      <div class="agent-name">{{ agent.name }}</div>
                      <div class="agent-desc">{{ agent.desc }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="category-label">{{ agent.category }}</span>
                </td>
                <td>
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="config[agent.id]?.enabled"
                      @change="$emit('toggle', agent.id, $event.target.checked)"
                    >
                    <span class="slider"></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="$emit('update:visible', false)">取消</button>
        <button class="btn btn-primary" @click="$emit('save')">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: String,
  agents: { type: Array, default: () => [] },
  config: { type: Object, default: () => ({}) },
  categories: { type: Array, default: () => [] },
  currentCategory: { type: String, default: '全部' }
})

defineEmits(['update:visible', 'update:current-category', 'toggle', 'toggle-all', 'update-order', 'save'])

const searchText = ref('')

const filteredAgents = computed(() => {
  let list = props.agents

  // 按类别过滤
  if (props.currentCategory !== '全部') {
    list = list.filter(a => a.category === props.currentCategory)
  }

  // 按搜索过滤
  if (searchText.value) {
    const text = searchText.value.toLowerCase()
    list = list.filter(a => a.name.toLowerCase().includes(text) || a.desc.toLowerCase().includes(text))
  }

  // 排序
  return [...list].sort((a, b) => {
    const configA = props.config[a.id] || { enabled: false, order: 0 }
    const configB = props.config[b.id] || { enabled: false, order: 0 }
    if (configA.enabled && !configB.enabled) return -1
    if (!configA.enabled && configB.enabled) return 1
    if (configA.enabled && configB.enabled) return configA.order - configB.order
    return 0
  })
})

const getCategoryCount = (cat) => {
  if (cat === '全部') return props.agents.length
  return props.agents.filter(a => a.category === cat).length
}
</script>
