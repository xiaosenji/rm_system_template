<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  remarks?: string;
}>();

const dialogVisible = ref(false);
</script>

<template>
  <el-button type="info" @click="dialogVisible = true"> 意见 </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="审批意见"
    width="400px"
    :append-to-body="true"
    :z-index="2000"
    destroy-on-close
  >
    <el-alert
      v-if="!remarks"
      title="暂无审批意见"
      type="info"
      :closable="false"
      class="mb-4"
    />
    <p v-else class="whitespace-pre-wrap px-4 py-3 bg-gray-50 rounded">
      {{ remarks }}
    </p>
  </el-dialog>
</template>
