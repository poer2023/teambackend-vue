<template>
  <div class="action-bar">
    <button class="btn btn-primary" @click="$emit('add')">
      <i class="fas fa-plus"></i> 新增版本
    </button>
    <button class="btn btn-success">
      <i class="fas fa-file-export"></i> 导出
    </button>
  </div>
</template>

<script setup>
defineEmits(['add'])
</script>
