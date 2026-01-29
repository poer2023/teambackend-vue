<template>
  <div class="pagination">
    <span class="page-info">1-{{ total }} 共{{ total }}条</span>
    <div class="page-buttons">
      <button class="page-btn active">1</button>
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
</template>

<script setup>
defineProps({
  total: { type: Number, default: 0 }
})
</script>
