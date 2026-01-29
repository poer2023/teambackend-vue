<template>
  <div class="modal" :class="{ show: visible }">
    <div class="modal-content" style="width: 400px;">
      <div class="modal-header">
        <h3>{{ editingId ? '编辑版本配置' : '新增版本配置' }}</h3>
        <span class="close" @click="$emit('update:visible', false)">&times;</span>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>版本名称 <span class="required">*</span></label>
          <select v-model="selectedType">
            <option value="">请选择版本</option>
            <option value="research">科研版</option>
            <option value="legal">法律版</option>
            <option value="enterprise">企业版</option>
            <option value="personal">个人版</option>
            <option value="shexiang">社想版</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="$emit('update:visible', false)">取消</button>
        <button class="btn btn-primary" @click="handleSave">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  editingId: String
})

const emit = defineEmits(['update:visible', 'save'])

const selectedType = ref('')

watch(() => props.visible, (val) => {
  if (val) {
    selectedType.value = ''
  }
})

const handleSave = () => {
  if (!selectedType.value) {
    alert('请选择版本类型')
    return
  }
  emit('save', selectedType.value)
}
</script>
