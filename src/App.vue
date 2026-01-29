<template>
  <div class="content">
        <ActionBar @add="openModal" />
        <VersionTable
          :versions="versions"
          @toggle-search="toggleSearch"
          @edit="editVersion"
          @delete="deleteVersion"
          @view-detail="viewDetail"
          @config-agents="openAgentConfig"
        />
        <Pagination :total="versions.length" />
    <VersionModal
      v-model:visible="modalVisible"
      :editing-id="editingId"
      @save="saveVersion"
    />

    <AgentModal
      v-model:visible="agentModalVisible"
      :title="agentModalTitle"
      :agents="agentsToShow"
      :config="tempAgentConfig"
      :categories="categoryList"
      :current-category="currentCategory"
      @update:current-category="currentCategory = $event"
      @toggle="toggleAgent"
      @toggle-all="toggleAllAgents"
      @update-order="updateAgentOrder"
      @save="saveAgentConfig"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ActionBar from './components/ActionBar.vue'
import VersionTable from './components/VersionTable.vue'
import Pagination from './components/Pagination.vue'
import VersionModal from './components/VersionModal.vue'
import AgentModal from './components/AgentModal.vue'
import { agentList, categoryList, versionTypeMap } from './data/agents'

// 版本数据
const versions = ref([
  {
    id: 'V20260128001',
    type: 'research',
    academicSearch: true,
    legalSearch: false,
    biddingSearch: false,
    hideKnowledgeBase: false,
    availableAgents: ['writing', 'research', 'translation', 'data'],
    defaultAgents: ['writing', 'research']
  },
  {
    id: 'V20260128002',
    type: 'legal',
    academicSearch: false,
    legalSearch: true,
    biddingSearch: true,
    hideKnowledgeBase: false,
    availableAgents: ['case-analysis', 'legal-research', 'contract-draft', 'contract-review', 'doc-writing'],
    defaultAgents: ['case-analysis', 'legal-research']
  },
  {
    id: 'V20260128003',
    type: 'enterprise',
    academicSearch: true,
    legalSearch: true,
    biddingSearch: true,
    hideKnowledgeBase: true,
    availableAgents: ['writing', 'research', 'translation', 'code', 'data', 'ppt', 'mind'],
    defaultAgents: ['writing', 'code', 'data']
  },
  {
    id: 'V20260128004',
    type: 'personal',
    academicSearch: true,
    legalSearch: false,
    biddingSearch: false,
    hideKnowledgeBase: true,
    availableAgents: ['writing', 'translation', 'ppt'],
    defaultAgents: ['writing']
  },
  {
    id: 'V20260128005',
    type: 'shexiang',
    academicSearch: true,
    legalSearch: false,
    biddingSearch: false,
    hideKnowledgeBase: false,
    availableAgents: ['writing', 'research', 'translation', 'data', 'ppt', 'mind'],
    defaultAgents: ['writing', 'research']
  }
])

// 版本弹窗
const modalVisible = ref(false)
const editingId = ref(null)

const openModal = () => {
  editingId.value = null
  modalVisible.value = true
}

const editVersion = (id) => {
  editingId.value = id
  modalVisible.value = true
}

const saveVersion = (type) => {
  if (editingId.value) {
    const index = versions.value.findIndex(v => v.id === editingId.value)
    if (index !== -1) {
      versions.value[index].type = type
    }
  } else {
    versions.value.unshift({
      id: 'V' + Date.now(),
      type,
      academicSearch: false,
      legalSearch: false,
      biddingSearch: false,
      hideKnowledgeBase: false,
      availableAgents: [],
      defaultAgents: []
    })
  }
  modalVisible.value = false
}

const deleteVersion = (id) => {
  if (confirm('确定要删除该版本配置吗？')) {
    versions.value = versions.value.filter(v => v.id !== id)
  }
}

const viewDetail = (id) => {
  const version = versions.value.find(v => v.id === id)
  if (!version) return
  const versionInfo = versionTypeMap[version.type]
  const availableNames = version.availableAgents.map(aid => {
    const agent = agentList.find(a => a.id === aid)
    return agent ? agent.name : aid
  }).join('、')
  const defaultNames = version.defaultAgents.map(aid => {
    const agent = agentList.find(a => a.id === aid)
    return agent ? agent.name : aid
  }).join('、')
  alert(`版本详情\n\n版本名称：${versionInfo.name}\n学术搜索：${version.academicSearch ? '开启' : '关闭'}\n法律搜索：${version.legalSearch ? '开启' : '关闭'}\n标讯搜索：${version.biddingSearch ? '开启' : '关闭'}\n隐藏知识库：${version.hideKnowledgeBase ? '开启' : '关闭'}\n全部智能体：${availableNames || '无'}\n默认开启：${defaultNames || '无'}`)
}

const toggleSearch = (id, field, value) => {
  const version = versions.value.find(v => v.id === id)
  if (version) {
    version[field] = value
  }
}

// 智能体配置弹窗
const agentModalVisible = ref(false)
const agentModalTitle = ref('')
const currentVersionId = ref(null)
const currentAgentType = ref(null)
const currentCategory = ref('全部')
const tempAgentConfig = ref({})

const agentsToShow = computed(() => {
  const version = versions.value.find(v => v.id === currentVersionId.value)
  if (!version) return []
  return currentAgentType.value === 'available'
    ? agentList
    : agentList.filter(agent => version.availableAgents.includes(agent.id))
})

const openAgentConfig = (versionId, type) => {
  currentVersionId.value = versionId
  currentAgentType.value = type
  currentCategory.value = '全部'

  const version = versions.value.find(v => v.id === versionId)
  if (!version) return

  const versionInfo = versionTypeMap[version.type]
  agentModalTitle.value = type === 'available'
    ? `配置全部智能体 - ${versionInfo.name}`
    : `配置默认开启 - ${versionInfo.name}`

  const currentAgents = type === 'available' ? version.availableAgents : version.defaultAgents
  const config = {}
  const agents = type === 'available'
    ? agentList
    : agentList.filter(agent => version.availableAgents.includes(agent.id))

  agents.forEach(agent => {
    const isEnabled = currentAgents.includes(agent.id)
    const orderIndex = currentAgents.indexOf(agent.id)
    config[agent.id] = { enabled: isEnabled, order: isEnabled ? orderIndex + 1 : 0 }
  })

  tempAgentConfig.value = config
  agentModalVisible.value = true
}

const toggleAgent = (agentId, enabled) => {
  if (enabled) {
    let maxOrder = 0
    Object.values(tempAgentConfig.value).forEach(c => { if (c.enabled && c.order > maxOrder) maxOrder = c.order })
    tempAgentConfig.value[agentId] = { enabled: true, order: maxOrder + 1 }
  } else {
    const oldOrder = tempAgentConfig.value[agentId]?.order || 0
    tempAgentConfig.value[agentId] = { enabled: false, order: 0 }
    Object.keys(tempAgentConfig.value).forEach(id => {
      if (tempAgentConfig.value[id].enabled && tempAgentConfig.value[id].order > oldOrder) {
        tempAgentConfig.value[id].order--
      }
    })
  }
}

const toggleAllAgents = (enabled) => {
  const version = versions.value.find(v => v.id === currentVersionId.value)
  if (!version) return

  let agents = currentAgentType.value === 'available'
    ? agentList
    : agentList.filter(a => version.availableAgents.includes(a.id))
  if (currentCategory.value !== '全部') agents = agents.filter(a => a.category === currentCategory.value)

  if (enabled) {
    let maxOrder = 0
    Object.values(tempAgentConfig.value).forEach(c => { if (c.enabled && c.order > maxOrder) maxOrder = c.order })
    agents.forEach(a => { if (!tempAgentConfig.value[a.id]?.enabled) tempAgentConfig.value[a.id] = { enabled: true, order: ++maxOrder } })
  } else {
    agents.forEach(a => { tempAgentConfig.value[a.id] = { enabled: false, order: 0 } })
    let order = 1
    Object.keys(tempAgentConfig.value).filter(id => tempAgentConfig.value[id].enabled)
      .sort((a, b) => tempAgentConfig.value[a].order - tempAgentConfig.value[b].order)
      .forEach(id => { tempAgentConfig.value[id].order = order++ })
  }
}

const updateAgentOrder = (agentId, newOrder) => {
  newOrder = parseInt(newOrder) || 1
  const oldOrder = tempAgentConfig.value[agentId]?.order || 0
  if (newOrder === oldOrder) return
  const enabledCount = Object.values(tempAgentConfig.value).filter(c => c.enabled).length
  newOrder = Math.max(1, Math.min(newOrder, enabledCount))

  Object.keys(tempAgentConfig.value).forEach(id => {
    if (id === agentId) return
    const c = tempAgentConfig.value[id]
    if (!c.enabled) return
    if (oldOrder < newOrder && c.order > oldOrder && c.order <= newOrder) c.order--
    else if (oldOrder > newOrder && c.order >= newOrder && c.order < oldOrder) c.order++
  })
  tempAgentConfig.value[agentId].order = newOrder
}

const saveAgentConfig = () => {
  const version = versions.value.find(v => v.id === currentVersionId.value)
  if (!version) return
  const enabledAgents = Object.keys(tempAgentConfig.value)
    .filter(id => tempAgentConfig.value[id].enabled)
    .sort((a, b) => tempAgentConfig.value[a].order - tempAgentConfig.value[b].order)

  if (currentAgentType.value === 'available') {
    version.availableAgents = enabledAgents
    version.defaultAgents = version.defaultAgents.filter(id => enabledAgents.includes(id))
  } else {
    version.defaultAgents = enabledAgents.filter(id => version.availableAgents.includes(id))
  }
  agentModalVisible.value = false
}
</script>

<style>
@import './styles/main.css';
</style>
