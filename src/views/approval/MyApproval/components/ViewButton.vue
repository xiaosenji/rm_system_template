// src/views/access/components/approval/ViewButton.vue
<script setup lang="ts">
import { ref } from "vue";
import type { PendingApproval } from "@/api/types";

const props = defineProps<{
  requestData: PendingApproval;
}>();

const dialogVisible = ref(false);
</script>

<template>
  <el-button type="primary" @click="dialogVisible = true"> 查看 </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="申请详情"
    width="600px"
    :append-to-body="true"
    :z-index="2000"
    destroy-on-close
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item label="申请人">
        {{ requestData.applicantName }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">
        {{ requestData.contact }}
      </el-descriptions-item>
      <el-descriptions-item label="机房名称">
        {{ requestData.roomName }}
      </el-descriptions-item>
      <el-descriptions-item label="申请类型">
        {{ requestData.requestType }}
      </el-descriptions-item>
      <el-descriptions-item label="进出目的">
        {{ requestData.visitPurpose }}
      </el-descriptions-item>
      <el-descriptions-item label="预计进入时间">
        {{ requestData.plannedEntryTime }}
      </el-descriptions-item>
      <el-descriptions-item label="预计离开时间">
        {{ requestData.plannedExitTime }}
      </el-descriptions-item>
      <el-descriptions-item label="进出目的详述">
        {{ requestData.purposeDescription || "暂无" }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
