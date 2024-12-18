// src/views/access/components/CancelButton.vue
<script setup lang="ts">
import { ElMessageBox } from "element-plus";

const props = defineProps<{
  requestId: number;
}>();

const emit = defineEmits(["cancel"]);

const handleCancel = () => {
  ElMessageBox.confirm("确认取消该申请？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    emit("cancel", props.requestId);
  });
};
</script>

<template>
  <el-button type="danger" @click="handleCancel"> 取消申请 </el-button>
</template>
