// 智能体列表
export const agentList = [
  { id: 'case-analysis', name: '类案分析报告', desc: '类案详情分析，提炼裁判规则', icon: 'fa-gavel', color: 'blue', category: '法律' },
  { id: 'legal-research', name: '法律研究报告', desc: '专业规范深度的法律研究报告', icon: 'fa-file-alt', color: 'blue', category: '法律' },
  { id: 'contract-draft', name: '合同起草', desc: '专业规范的合同文本生成', icon: 'fa-file-signature', color: 'orange', category: '法律' },
  { id: 'contract-review', name: '合同审查', desc: '遵循审查要求，智能合同审查', icon: 'fa-search', color: 'green', category: '法律' },
  { id: 'doc-writing', name: '文书写作', desc: '快速生成各类规范法律文书', icon: 'fa-pen-fancy', color: 'purple', category: '法律' },
  { id: 'doc-review', name: '文书审查', desc: '答辩状、申请书、委托书、律师函、法律意见书、证据清单等各类文书审查', icon: 'fa-clipboard-check', color: 'cyan', category: '法律' },
  { id: 'lawsuit', name: '民事起诉状', desc: '要素式起诉状，专业律师水准', icon: 'fa-balance-scale', color: 'red', category: '法律' },
  { id: 'doc-correction', name: '文档纠错', desc: '文档智能纠错，输出可执行修正建议', icon: 'fa-spell-check', color: 'gold', category: '职场精选' },
  { id: 'contract-compare', name: '合同比对', desc: '智能比对版本差异，标注改动与潜在风险', icon: 'fa-copy', color: 'pink', category: '法律' },
  { id: 'ppt', name: 'PPT', desc: '一键快速生成，轻松搞定PPT', icon: 'fa-file-powerpoint', color: 'orange', category: '职场精选' },
  { id: 'scan-parse', name: '扫描件解析', desc: '上传扫描文件，AI智能解析提取文字内容', icon: 'fa-file-image', color: 'green', category: '职场精选' },
  { id: 'writing', name: '写作助手', desc: '智能写作辅助，提升文档质量', icon: 'fa-pencil-alt', color: 'blue', category: '学术教育' },
  { id: 'research', name: '科研助手', desc: '学术研究支持，文献分析整理', icon: 'fa-flask', color: 'purple', category: '学术教育' },
  { id: 'translation', name: '翻译助手', desc: '多语言翻译，专业术语准确', icon: 'fa-language', color: 'cyan', category: '学术教育' },
  { id: 'code', name: '代码助手', desc: '代码生成与调试支持', icon: 'fa-code', color: 'green', category: '职场精选' },
  { id: 'data', name: '数据分析', desc: '数据可视化与分析报告', icon: 'fa-chart-bar', color: 'gold', category: '商业分析' },
  { id: 'mind', name: '思维导图', desc: '快速生成结构化思维导图', icon: 'fa-project-diagram', color: 'pink', category: '职场精选' },
  { id: 'literature', name: '文献综述', desc: '文献总结评价，观点深入剖析', icon: 'fa-book', color: 'blue', category: '学术教育' },
  { id: 'thesis', name: '论文助手', desc: '基于专业知识库的论文专家', icon: 'fa-graduation-cap', color: 'purple', category: '学术教育' },
  { id: 'report', name: '开题报告', desc: '万事开头难，开题报告特别难～来，点我！', icon: 'fa-file-alt', color: 'orange', category: '学术教育' }
]

// 类别列表
export const categoryList = ['全部', '学术教育', '法律', '职场精选', '商业分析']

// 版本类型映射
export const versionTypeMap = {
  'research': { name: '科研版', class: 'version-research' },
  'legal': { name: '法律版', class: 'version-legal' },
  'enterprise': { name: '企业版', class: 'version-enterprise' },
  'personal': { name: '个人版', class: 'version-personal' },
  'shexiang': { name: '社想版', class: 'version-shexiang' }
}
