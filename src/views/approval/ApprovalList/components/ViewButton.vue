<script setup lang="ts">
import { ref } from "vue";
import type { ApprovalResult } from "@/api/types";

const props = defineProps<{
  recordData: ApprovalResult;
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
    <el-descriptions title="基本信息" :column="1" border>
      <el-descriptions-item label="申请人">
        {{ recordData.applicantName }}
      </el-descriptions-item>
      <el-descriptions-item label="联系方式">
        {{ recordData.requestDetails.contact }}
      </el-descriptions-item>
      <el-descriptions-item label="机房名称">
        {{ recordData.requestDetails.roomName }}
      </el-descriptions-item>
      <el-descriptions-item label="申请类型">
        {{ recordData.requestDetails.requestType }}
      </el-descriptions-item>
      <el-descriptions-item label="进出目的">
        {{ recordData.requestDetails.visitPurpose }}
      </el-descriptions-item>
      <el-descriptions-item label="预计进入时间">
        {{ recordData.requestDetails.plannedEntryTime }}
      </el-descriptions-item>
      <el-descriptions-item label="预计离开时间">
        {{ recordData.requestDetails.plannedExitTime }}
      </el-descriptions-item>
      <el-descriptions-item label="进出目的详述">
        {{ recordData.requestDetails.purposeDescription || "暂无" }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="审批信息" :column="1" border class="mt-4">
      <el-descriptions-item label="审批人">
        {{ recordData.approverName }}
      </el-descriptions-item>
      <el-descriptions-item label="审批结果">
        <el-tag
          :type="recordData.approvalResult === '通过' ? 'success' : 'danger'"
        >
          {{ recordData.approvalResult }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="审批时间">
        {{ recordData.createdAt }}
      </el-descriptions-item>
      <el-descriptions-item label="审批意见">
        {{ recordData.approvalRemarks || "暂无" }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
