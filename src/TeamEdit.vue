<template>
  <div class="content">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-item">
        <label>销售信息：</label>
        <input type="text" v-model="searchSales" placeholder="请输入销售信息">
      </div>
      <div class="search-item">
        <label>团队名称：</label>
        <input type="text" v-model="searchTeamName" placeholder="请输入团队名称">
      </div>
      <button class="btn btn-primary">
        <i class="fas fa-search"></i> 查询
      </button>
      <button class="btn btn-default">
        <i class="fas fa-redo"></i> 重置
      </button>
      <span class="expand-btn">展开 <i class="fas fa-chevron-down"></i></span>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <button class="btn btn-primary" @click="openAddModal">
        <i class="fas fa-plus"></i> 新增
      </button>
      <button class="btn btn-primary">
        <i class="fas fa-file-import"></i> 导入
      </button>
      <button class="btn btn-primary">
        <i class="fas fa-file-export"></i> 导出
      </button>
      <button class="btn btn-primary">
        <i class="fas fa-filter"></i> 高级查询
      </button>
    </div>

    <!-- 提示信息 -->
    <div class="info-bar">
      <i class="fas fa-info-circle"></i>
      <span>未选中任何数据</span>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox"></th>
            <th>销售信息</th>
            <th>壳应用</th>
            <th>团队名称</th>
            <th>团队logo URL</th>
            <th>状态(active, inactive)</th>
            <th>团队简称</th>
            <th>团队标语</th>
            <th>域名信息</th>
            <th>最大成员数限制</th>
            <th>版本</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in teamList" :key="item.id">
            <td><input type="checkbox"></td>
            <td>{{ item.sales }}</td>
            <td>{{ item.shellApp }}</td>
            <td>{{ item.teamName }}</td>
            <td>
              <span v-if="item.logoUrl" class="logo-preview">
                <img :src="item.logoUrl" alt="logo" style="width: 24px; height: 24px;">
              </span>
              <span v-else>无图片</span>
            </td>
            <td>{{ item.status }}</td>
            <td>{{ item.shortName }}</td>
            <td>{{ item.slogan }}</td>
            <td>{{ item.domain }}</td>
            <td>{{ item.maxMembers }}</td>
            <td>{{ getVersionName(item.versionType) }}</td>
            <td>
              <div class="action-btns">
                <button class="btn btn-link" @click="openEditModal(item)">
                  <i class="fas fa-edit"></i> 编辑
                </button>
                <div class="dropdown">
                  <button class="btn btn-link dropdown-toggle" @click="toggleDropdown(item.id)">
                    更多 <i class="fas fa-chevron-down"></i>
                  </button>
                  <div class="dropdown-menu" :class="{ show: activeDropdown === item.id }">
                    <div class="dropdown-item" @click="viewDetail(item)">
                      <i class="fas fa-eye"></i> 详情
                    </div>
                    <div class="dropdown-item danger" @click="deleteTeam(item.id)">
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

    <!-- 分页 -->
    <div class="pagination">
      <span class="page-info">1-10 共{{ teamList.length }}条</span>
      <div class="page-buttons">
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn">4</button>
        <button class="page-btn">5</button>
        <span>...</span>
        <button class="page-btn">24</button>
        <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
      </div>
      <select class="page-size">
        <option>10 条/页</option>
        <option>20 条/页</option>
        <option>50 条/页</option>
      </select>
      <span>跳至</span>
      <input type="text" class="page-jump">
      <span>页</span>
    </div>

    <!-- 编辑弹窗 -->
    <div class="modal" :class="{ show: modalVisible }">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3>编辑</h3>
          <div class="modal-header-actions">
            <i class="fas fa-expand"></i>
            <span class="close" @click="closeModal">&times;</span>
          </div>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label>销售信息：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.sales">
              <i class="fas fa-times clear-icon" @click="editForm.sales = ''"></i>
            </div>
          </div>
          <div class="form-row">
            <label>壳应用：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.shellApp">
            </div>
          </div>
          <div class="form-row">
            <label>团队名称：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.teamName">
              <i class="fas fa-times clear-icon" @click="editForm.teamName = ''"></i>
            </div>
          </div>
          <div class="form-row">
            <label>团队logo：</label>
            <div class="upload-box">
              <div class="upload-placeholder">
                <i class="fas fa-plus"></i>
                <span>上传</span>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label>状态：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.status">
              <i class="fas fa-times clear-icon" @click="editForm.status = ''"></i>
            </div>
          </div>
          <div class="form-row">
            <label>团队简称：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.shortName">
              <i class="fas fa-times clear-icon" @click="editForm.shortName = ''"></i>
            </div>
          </div>
          <div class="form-row">
            <label>团队标语：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.slogan">
              <i class="fas fa-times clear-icon" @click="editForm.slogan = ''"></i>
            </div>
          </div>
          <div class="form-row">
            <label>域名信息：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.domain">
              <i class="fas fa-times clear-icon" @click="editForm.domain = ''"></i>
            </div>
          </div>
          <div class="form-row">
            <label>最大成员：</label>
            <div class="form-input">
              <input type="number" v-model="editForm.maxMembers">
            </div>
          </div>
          <div class="form-row">
            <label>版本开始：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.versionStart" placeholder="2026-01-27 00:00:00">
              <i class="fas fa-calendar"></i>
            </div>
          </div>
          <div class="form-row">
            <label>版本结束：</label>
            <div class="form-input">
              <input type="text" v-model="editForm.versionEnd" placeholder="2026-04-27 00:00:00">
              <i class="fas fa-calendar"></i>
            </div>
          </div>

          <!-- 版本信息 -->
          <div class="form-row">
            <label>团队版本：</label>
            <div class="form-input">
              <select v-model="editForm.versionType" @change="onVersionChange">
                <option value="">请选择版本</option>
                <option v-for="(info, key) in versionTypeMap" :key="key" :value="key">
                  {{ info.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- 版本配置（可折叠） -->
          <div class="version-config-section" v-if="editForm.versionType">
            <div class="section-header" @click="configExpanded = !configExpanded">
              <i class="fas" :class="configExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
              <span>版本配置（开关与设置）</span>
            </div>
            <div class="section-content" v-show="configExpanded">
              <!-- 开关配置 -->
              <div class="switch-group">
                <div class="switch-item">
                  <span>学术搜索</span>
                  <label class="switch">
                    <input type="checkbox" v-model="editForm.academicSearch">
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="switch-item">
                  <span>法律搜索</span>
                  <label class="switch">
                    <input type="checkbox" v-model="editForm.legalSearch">
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="switch-item">
                  <span>标讯搜索</span>
                  <label class="switch">
                    <input type="checkbox" v-model="editForm.biddingSearch">
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="switch-item">
                  <span>隐藏知识库</span>
                  <label class="switch">
                    <input type="checkbox" v-model="editForm.hideKnowledgeBase">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>

              <!-- 智能体配置 -->
              <div class="form-row" style="margin-top: 16px;">
                <label>全部智能体：</label>
                <div class="form-input">
                  <div class="agent-summary">
                    <span class="agent-count">已选择 {{ editForm.availableAgents.length }} 个</span>
                    <span class="config-btn" @click="toggleAvailablePanel">
                      配置 <i class="fas" :class="availablePanelExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 全部智能体内嵌配置面板 -->
              <div class="inline-agent-panel" v-show="availablePanelExpanded">
                <div class="panel-toolbar">
                  <div class="toolbar-row">
                    <input type="text" v-model="availableSearchKeyword" placeholder="搜索智能体..." class="panel-search">
                    <div class="batch-actions">
                      <button class="btn btn-sm" @click="toggleAllInline('available', true)">全部开启</button>
                      <button class="btn btn-sm" @click="toggleAllInline('available', false)">全部关闭</button>
                    </div>
                  </div>
                  <div class="category-tabs">
                    <span
                      v-for="cat in categoryList"
                      :key="cat"
                      class="category-tab"
                      :class="{ active: availableCategory === cat }"
                      @click="availableCategory = cat"
                    >{{ cat }}</span>
                  </div>
                </div>
                <table class="inline-agent-table">
                  <thead>
                    <tr>
                      <th style="width: 60px;">序号</th>
                      <th>智能体名称</th>
                      <th style="width: 100px;">类别</th>
                      <th style="width: 80px;">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(agent, index) in pagedAvailableAgents" :key="agent.id">
                      <td>
                        <input
                          type="number"
                          class="order-input"
                          :value="getAgentOrder('available', agent.id)"
                          :disabled="!editForm.availableAgents.includes(agent.id)"
                          @change="updateAgentOrder('available', agent.id, $event.target.value)"
                          min="1"
                        >
                      </td>
                      <td>{{ agent.name }}</td>
                      <td>{{ agent.category }}</td>
                      <td>
                        <label class="switch" @click.stop>
                          <input type="checkbox" :checked="editForm.availableAgents.includes(agent.id)" @change="toggleInlineAgent('available', agent.id, $event.target.checked)">
                          <span class="slider"></span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="panel-pagination" v-if="availableTotalPages > 1">
                  <span class="page-info">共 {{ filteredAvailableAgents.length }} 条</span>
                  <div class="page-btns">
                    <button class="page-btn" :disabled="availablePage === 1" @click="availablePage--">&lt;</button>
                    <span class="page-current">{{ availablePage }} / {{ availableTotalPages }}</span>
                    <button class="page-btn" :disabled="availablePage === availableTotalPages" @click="availablePage++">&gt;</button>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <label>默认开启：</label>
                <div class="form-input">
                  <div class="agent-summary">
                    <span class="agent-count">已选择 {{ editForm.defaultAgents.length }} 个</span>
                    <span class="config-btn" @click="toggleDefaultPanel">
                      配置 <i class="fas" :class="defaultPanelExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 默认开启内嵌配置面板 -->
              <div class="inline-agent-panel" v-show="defaultPanelExpanded">
                <div class="panel-toolbar">
                  <div class="toolbar-row">
                    <input type="text" v-model="defaultSearchKeyword" placeholder="搜索智能体..." class="panel-search">
                    <div class="batch-actions">
                      <button class="btn btn-sm" @click="toggleAllInline('default', true)">全部开启</button>
                      <button class="btn btn-sm" @click="toggleAllInline('default', false)">全部关闭</button>
                    </div>
                  </div>
                  <div class="category-tabs">
                    <span
                      v-for="cat in categoryList"
                      :key="cat"
                      class="category-tab"
                      :class="{ active: defaultCategory === cat }"
                      @click="defaultCategory = cat"
                    >{{ cat }}</span>
                  </div>
                </div>
                <table class="inline-agent-table">
                  <thead>
                    <tr>
                      <th style="width: 60px;">序号</th>
                      <th>智能体名称</th>
                      <th style="width: 100px;">类别</th>
                      <th style="width: 80px;">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(agent, index) in pagedDefaultAgents" :key="agent.id">
                      <td>
                        <input
                          type="number"
                          class="order-input"
                          :value="getAgentOrder('default', agent.id)"
                          :disabled="!editForm.defaultAgents.includes(agent.id)"
                          @change="updateAgentOrder('default', agent.id, $event.target.value)"
                          min="1"
                        >
                      </td>
                      <td>{{ agent.name }}</td>
                      <td>{{ agent.category }}</td>
                      <td>
                        <label class="switch" @click.stop>
                          <input type="checkbox" :checked="editForm.defaultAgents.includes(agent.id)" @change="toggleInlineAgent('default', agent.id, $event.target.checked)">
                          <span class="slider"></span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="panel-pagination" v-if="defaultTotalPages > 1">
                  <span class="page-info">共 {{ filteredDefaultAgents.length }} 条</span>
                  <div class="page-btns">
                    <button class="page-btn" :disabled="defaultPage === 1" @click="defaultPage--">&lt;</button>
                    <span class="page-current">{{ defaultPage }} / {{ defaultTotalPages }}</span>
                    <button class="page-btn" :disabled="defaultPage === defaultTotalPages" @click="defaultPage++">&gt;</button>
                  </div>
                </div>
              </div>

              <!-- 配置信息 -->
              <div class="form-row">
                <label>配置信息：</label>
                <div class="form-input">
                  <textarea v-model="editForm.config" rows="4" placeholder="JSON格式配置"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="saveTeam">确定</button>
          <button class="btn btn-default" @click="closeModal">关闭</button>
        </div>
      </div>
    </div>

    <!-- 版本切换确认弹窗 -->
    <div class="modal" :class="{ show: versionConfirmVisible }">
      <div class="modal-content" style="width: 400px;">
        <div class="modal-header">
          <h3>版本切换确认</h3>
          <span class="close" @click="cancelVersionChange">&times;</span>
        </div>
        <div class="modal-body">
          <p>确定要将版本切换为「{{ getVersionName(pendingVersionType) }}」吗？</p>
          <p style="color: #999; font-size: 12px; margin-top: 8px;">切换后将应用该版本的默认配置</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="confirmVersionChange">确定</button>
          <button class="btn btn-default" @click="cancelVersionChange">取消</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { agentList, categoryList, versionTypeMap } from './data/agents'

const searchSales = ref('')
const searchTeamName = ref('')
const activeDropdown = ref(null)
const modalVisible = ref(false)
const configExpanded = ref(false)
const versionConfirmVisible = ref(false)
const pendingVersionType = ref('')
const previousVersionType = ref('')

// 智能体内嵌配置面板相关
const availablePanelExpanded = ref(false)
const defaultPanelExpanded = ref(false)
const availableSearchKeyword = ref('')
const defaultSearchKeyword = ref('')
const availableCategory = ref('全部')
const defaultCategory = ref('全部')

// 分页相关
const availablePage = ref(1)
const defaultPage = ref(1)
const pageSize = 10

const editForm = reactive({
  id: null,
  sales: '',
  shellApp: '',
  teamName: '',
  logoUrl: '',
  status: '',
  shortName: '',
  slogan: '',
  domain: '',
  maxMembers: 0,
  versionStart: '',
  versionEnd: '',
  versionType: '',
  academicSearch: false,
  legalSearch: false,
  biddingSearch: false,
  hideKnowledgeBase: false,
  availableAgents: [],
  defaultAgents: [],
  config: ''
})

// 版本默认配置
const versionDefaults = {
  research: {
    academicSearch: true,
    legalSearch: false,
    biddingSearch: false,
    hideKnowledgeBase: false,
    availableAgents: ['writing', 'research', 'translation', 'data'],
    defaultAgents: ['writing', 'research']
  },
  legal: {
    academicSearch: false,
    legalSearch: true,
    biddingSearch: true,
    hideKnowledgeBase: false,
    availableAgents: ['case-analysis', 'legal-research', 'contract-draft', 'contract-review', 'doc-writing', 'doc-review', 'lawsuit'],
    defaultAgents: ['case-analysis', 'legal-research']
  },
  enterprise: {
    academicSearch: true,
    legalSearch: true,
    biddingSearch: true,
    hideKnowledgeBase: true,
    availableAgents: ['writing', 'research', 'translation', 'code', 'data', 'ppt', 'mind'],
    defaultAgents: ['writing', 'code', 'data']
  },
  personal: {
    academicSearch: true,
    legalSearch: false,
    biddingSearch: false,
    hideKnowledgeBase: true,
    availableAgents: ['writing', 'translation', 'ppt'],
    defaultAgents: ['writing']
  },
  shexiang: {
    academicSearch: true,
    legalSearch: false,
    biddingSearch: false,
    hideKnowledgeBase: false,
    availableAgents: ['writing', 'research', 'translation', 'data', 'ppt', 'mind'],
    defaultAgents: ['writing', 'research']
  }
}

const teamList = ref([
  {
    id: 1,
    sales: '李新德',
    shellApp: 'team-201605777...',
    teamName: '上海鸿翼智城数据...',
    logoUrl: '',
    status: 'trial',
    shortName: '鸿翼智城',
    slogan: 'AI 法律助手',
    domain: 'hyzc.inschool.top',
    maxMembers: 20,
    versionType: 'legal'
  },
  {
    id: 2,
    sales: '社悦',
    shellApp: 'shexiang-201567...',
    teamName: '上海社会工作者协...',
    logoUrl: 'https://via.placeholder.com/24',
    status: 'active',
    shortName: '上海社工协会',
    slogan: 'AI科研助手',
    domain: 'shsshgzxh.shexian...',
    maxMembers: 11,
    versionType: 'research'
  },
  {
    id: 3,
    sales: '包陈岚',
    shellApp: 'team-201356391...',
    teamName: '上海电信徐子怡团队',
    logoUrl: '',
    status: 'active',
    shortName: '上海电信',
    slogan: '企业AI助手',
    domain: 'dxxzy.inschool.top',
    maxMembers: 10,
    versionType: 'enterprise'
  },
  {
    id: 4,
    sales: '包陈岚',
    shellApp: 'team-201356389...',
    teamName: '房科院知识库测试',
    logoUrl: '',
    status: 'active',
    shortName: '房地产科学院',
    slogan: 'AI科研助手',
    domain: 'dxhxy.inschool.top',
    maxMembers: 10,
    versionType: 'research'
  },
  {
    id: 5,
    sales: '王俊杰',
    shellApp: 'team-201354653...',
    teamName: '陕西科技大学',
    logoUrl: '',
    status: 'trial',
    shortName: '陕西科大团委',
    slogan: '团学数字大脑',
    domain: 'susttw.inschool.top',
    maxMembers: 10,
    versionType: 'shexiang'
  },
  {
    id: 6,
    sales: '张贺峰',
    shellApp: 'team-201354480...',
    teamName: '安徽师范大学',
    logoUrl: '',
    status: 'trial',
    shortName: '安徽师范大学',
    slogan: 'AI科研助手',
    domain: 'yx.inschool.top',
    maxMembers: 10,
    versionType: 'research'
  },
  {
    id: 7,
    sales: '张贺峰',
    shellApp: 'team-201206540...',
    teamName: '淮南师范学院',
    logoUrl: '',
    status: 'trial',
    shortName: '缘国鹏团队',
    slogan: '涌见AI科研助手',
    domain: 'mgp.inschool.top',
    maxMembers: 10,
    versionType: 'research'
  },
  {
    id: 8,
    sales: '李新德',
    shellApp: 'team-201206540...',
    teamName: '北大元法大模型',
    logoUrl: 'https://via.placeholder.com/24',
    status: 'active',
    shortName: '北大元法',
    slogan: '涌见版',
    domain: 'pkulaw.inschool.top',
    maxMembers: 100,
    versionType: 'legal'
  },
  {
    id: 9,
    sales: '王浩',
    shellApp: 'team-201164807...',
    teamName: '涌见AI法律版',
    logoUrl: 'https://via.placeholder.com/24',
    status: 'active',
    shortName: '涌见AI',
    slogan: 'AI法律助手',
    domain: 'law.ahasci.cn',
    maxMembers: 100,
    versionType: 'legal'
  },
  {
    id: 10,
    sales: '褚智明',
    shellApp: 'team-201067352...',
    teamName: '淮安市金融学会',
    logoUrl: '',
    status: 'trial',
    shortName: '淮安金融学会',
    slogan: 'AI科研助手',
    domain: 'hajrxh.inschool.top',
    maxMembers: 20,
    versionType: 'enterprise'
  }
])

const getVersionName = (type) => {
  return versionTypeMap[type]?.name || '-'
}

const getAgentName = (agentId) => {
  const agent = agentList.find(a => a.id === agentId)
  return agent ? agent.name : agentId
}

// 过滤后的智能体列表（用于内嵌面板）
const filteredAvailableAgents = computed(() => {
  let agents = agentList
  if (availableCategory.value !== '全部') {
    agents = agents.filter(a => a.category === availableCategory.value)
  }
  if (availableSearchKeyword.value) {
    const keyword = availableSearchKeyword.value.toLowerCase()
    agents = agents.filter(a => a.name.toLowerCase().includes(keyword))
  }
  return agents
})

const filteredDefaultAgents = computed(() => {
  // 默认开启只能从全部智能体中选择
  let agents = agentList.filter(a => editForm.availableAgents.includes(a.id))
  if (defaultCategory.value !== '全部') {
    agents = agents.filter(a => a.category === defaultCategory.value)
  }
  if (defaultSearchKeyword.value) {
    const keyword = defaultSearchKeyword.value.toLowerCase()
    agents = agents.filter(a => a.name.toLowerCase().includes(keyword))
  }
  return agents
})

// 分页后的智能体列表
const pagedAvailableAgents = computed(() => {
  const start = (availablePage.value - 1) * pageSize
  return filteredAvailableAgents.value.slice(start, start + pageSize)
})

const pagedDefaultAgents = computed(() => {
  const start = (defaultPage.value - 1) * pageSize
  return filteredDefaultAgents.value.slice(start, start + pageSize)
})

// 总页数
const availableTotalPages = computed(() => Math.ceil(filteredAvailableAgents.value.length / pageSize))
const defaultTotalPages = computed(() => Math.ceil(filteredDefaultAgents.value.length / pageSize))

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const closeDropdowns = (e) => {
  if (!e.target.closest('.dropdown')) {
    activeDropdown.value = null
  }
}

const openAddModal = () => {
  Object.assign(editForm, {
    id: null,
    sales: '',
    shellApp: '',
    teamName: '',
    logoUrl: '',
    status: '',
    shortName: '',
    slogan: '',
    domain: '',
    maxMembers: 0,
    versionStart: '',
    versionEnd: '',
    versionType: '',
    academicSearch: false,
    legalSearch: false,
    biddingSearch: false,
    hideKnowledgeBase: false,
    availableAgents: [],
    defaultAgents: [],
    config: ''
  })
  configExpanded.value = false
  modalVisible.value = true
}

const openEditModal = (item) => {
  const defaults = versionDefaults[item.versionType] || {}
  Object.assign(editForm, {
    id: item.id,
    sales: item.sales,
    shellApp: item.shellApp,
    teamName: item.teamName,
    logoUrl: item.logoUrl,
    status: item.status,
    shortName: item.shortName,
    slogan: item.slogan,
    domain: item.domain,
    maxMembers: item.maxMembers,
    versionStart: '2026-01-27 00:00:00',
    versionEnd: '2026-04-27 00:00:00',
    versionType: item.versionType || '',
    academicSearch: defaults.academicSearch || false,
    legalSearch: defaults.legalSearch || false,
    biddingSearch: defaults.biddingSearch || false,
    hideKnowledgeBase: defaults.hideKnowledgeBase || false,
    availableAgents: [...(defaults.availableAgents || [])],
    defaultAgents: [...(defaults.defaultAgents || [])],
    config: ''
  })
  previousVersionType.value = item.versionType || ''
  configExpanded.value = false
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
}

const onVersionChange = () => {
  if (editForm.versionType && editForm.versionType !== previousVersionType.value) {
    pendingVersionType.value = editForm.versionType
    editForm.versionType = previousVersionType.value
    versionConfirmVisible.value = true
  }
}

const confirmVersionChange = () => {
  const newType = pendingVersionType.value
  const defaults = versionDefaults[newType] || {}

  editForm.versionType = newType
  editForm.academicSearch = defaults.academicSearch || false
  editForm.legalSearch = defaults.legalSearch || false
  editForm.biddingSearch = defaults.biddingSearch || false
  editForm.hideKnowledgeBase = defaults.hideKnowledgeBase || false
  editForm.availableAgents = [...(defaults.availableAgents || [])]
  editForm.defaultAgents = [...(defaults.defaultAgents || [])]
  editForm.config = ''

  previousVersionType.value = newType
  versionConfirmVisible.value = false
}

const cancelVersionChange = () => {
  versionConfirmVisible.value = false
  pendingVersionType.value = ''
}

// 切换内嵌面板展开/收起
const toggleAvailablePanel = () => {
  availablePanelExpanded.value = !availablePanelExpanded.value
  if (availablePanelExpanded.value) {
    defaultPanelExpanded.value = false
  }
}

const toggleDefaultPanel = () => {
  defaultPanelExpanded.value = !defaultPanelExpanded.value
  if (defaultPanelExpanded.value) {
    availablePanelExpanded.value = false
  }
}

// 切换单个智能体
const toggleInlineAgent = (type, agentId, enabled) => {
  if (type === 'available') {
    if (enabled) {
      if (!editForm.availableAgents.includes(agentId)) {
        editForm.availableAgents.push(agentId)
      }
    } else {
      editForm.availableAgents = editForm.availableAgents.filter(id => id !== agentId)
      editForm.defaultAgents = editForm.defaultAgents.filter(id => id !== agentId)
    }
  } else {
    if (enabled) {
      if (!editForm.defaultAgents.includes(agentId)) {
        editForm.defaultAgents.push(agentId)
      }
    } else {
      editForm.defaultAgents = editForm.defaultAgents.filter(id => id !== agentId)
    }
  }
}

// 批量切换智能体
const toggleAllInline = (type, enabled) => {
  const agents = type === 'available' ? filteredAvailableAgents.value : filteredDefaultAgents.value
  agents.forEach(agent => {
    toggleInlineAgent(type, agent.id, enabled)
  })
}

// 获取智能体序号
const getAgentOrder = (type, agentId) => {
  const agents = type === 'available' ? editForm.availableAgents : editForm.defaultAgents
  const index = agents.indexOf(agentId)
  return index >= 0 ? index + 1 : ''
}

// 更新智能体序号（调整排序）
const updateAgentOrder = (type, agentId, newOrder) => {
  const agents = type === 'available' ? editForm.availableAgents : editForm.defaultAgents
  const currentIndex = agents.indexOf(agentId)
  if (currentIndex < 0) return

  newOrder = parseInt(newOrder) || 1
  const newIndex = Math.max(0, Math.min(newOrder - 1, agents.length - 1))

  if (currentIndex === newIndex) return

  // 移除当前位置
  agents.splice(currentIndex, 1)
  // 插入新位置
  agents.splice(newIndex, 0, agentId)
}

const saveTeam = () => {
  if (editForm.id) {
    const team = teamList.value.find(t => t.id === editForm.id)
    if (team) {
      Object.assign(team, {
        sales: editForm.sales,
        shellApp: editForm.shellApp,
        teamName: editForm.teamName,
        logoUrl: editForm.logoUrl,
        status: editForm.status,
        shortName: editForm.shortName,
        slogan: editForm.slogan,
        domain: editForm.domain,
        maxMembers: editForm.maxMembers,
        versionType: editForm.versionType
      })
    }
  }
  closeModal()
}

const viewDetail = (item) => {
  activeDropdown.value = null
  alert(`团队详情：\n\n团队名称：${item.teamName}\n销售信息：${item.sales}\n状态：${item.status}\n域名：${item.domain}\n版本：${getVersionName(item.versionType)}`)
}

const deleteTeam = (id) => {
  activeDropdown.value = null
  if (confirm('确定要删除该团队吗？')) {
    teamList.value = teamList.value.filter(t => t.id !== id)
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style>
@import './styles/main.css';
@import './styles/team-edit.css';

.version-config-section {
  margin-top: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.section-header {
  padding: 12px 16px;
  background: #fafafa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.section-header:hover {
  background: #f0f0f0;
}

.section-content {
  padding: 16px;
}

.switch-group {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-item span {
  color: #666;
}

.agent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.agent-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #1890ff;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.agent-tag i {
  cursor: pointer;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.agent-tag i:hover {
  color: #fff;
}

.add-agent-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.add-agent-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.agent-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.agent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.agent-item:hover {
  border-color: #1890ff;
  background: #e6f7ff;
}

.form-input select {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  background: #fff;
}

.form-input select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 智能体数量显示 */
.agent-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.agent-count {
  color: #666;
  font-size: 14px;
}

.config-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #1890ff;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s;
}

.config-btn:hover {
  border-color: #1890ff;
  background: #e6f7ff;
}

/* 内嵌智能体配置面板 */
.inline-agent-panel {
  margin: 12px 0 16px 0;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fafafa;
}

.panel-toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
}

.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-search {
  width: 200px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  font-size: 13px;
}

.panel-search:focus {
  border-color: #1890ff;
}

.category-tabs {
  display: flex;
  gap: 8px;
}

.category-tab {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  background: #f0f0f0;
  transition: all 0.2s;
}

.category-tab:hover {
  color: #1890ff;
}

.category-tab.active {
  background: #1890ff;
  color: #fff;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.btn-sm:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.inline-agent-table {
  width: 100%;
  border-collapse: collapse;
}

.inline-agent-table th,
.inline-agent-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.inline-agent-table th {
  background: #fafafa;
  font-weight: 500;
  color: #333;
  font-size: 13px;
}

.inline-agent-table td {
  background: #fff;
  font-size: 13px;
  color: #666;
}

.inline-agent-table tbody tr:hover {
  background: #f5f5f5;
}

.inline-agent-table tbody tr:hover td {
  background: #f5f5f5;
}

/* 内嵌面板分页 */
.panel-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
}

.panel-pagination .page-info {
  font-size: 13px;
  color: #666;
}

.panel-pagination .page-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-pagination .page-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
}

.panel-pagination .page-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.panel-pagination .page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.panel-pagination .page-current {
  font-size: 13px;
  color: #333;
}

/* 修复开关样式 */
.inline-agent-table .switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  cursor: pointer;
}

.inline-agent-table .switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.inline-agent-table .switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 22px;
}

.inline-agent-table .switch .slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.inline-agent-table .switch input:checked + .slider {
  background-color: #1890ff;
}

.inline-agent-table .switch input:checked + .slider:before {
  transform: translateX(22px);
}

/* 序号输入框 */
.order-input {
  width: 50px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  outline: none;
}

.order-input:focus {
  border-color: #1890ff;
}

.order-input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}
</style>
