<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { ApprovalResult } from "@/api/types";
import ViewButton from "./components/ViewButton.vue";

const tableData = ref<ApprovalResult[]>([]);
const loading = ref(false);

// 模拟数据
const mockData: ApprovalResult[] = [
  {
    approvalId: 1,
    applicantName: "张三",
    approverName: "李主管",
    approvalResult: "通过",
    approvalRemarks: "同意访问",
    createdAt: "2024-12-18 09:30:00",
    requestDetails: {
      roomName: "机房A",
      requestType: "临时访问",
      visitPurpose: "设备维护",
      plannedEntryTime: "2024-12-18 10:00:00",
      plannedExitTime: "2024-12-18 11:00:00",
      purposeDescription: "更换服务器硬盘",
      contact: "13800138000"
    }
  },
  {
    approvalId: 2,
    applicantName: "李四",
    approverName: "李主管",
    approvalResult: "驳回",
    approvalRemarks: "申请信息不完整，请补充详细用途",
    createdAt: "2024-12-18 14:30:00",
    requestDetails: {
      roomName: "机房B",
      requestType: "常规访问",
      visitPurpose: "日常巡检",
      plannedEntryTime: "2024-12-18 15:00:00",
      plannedExitTime: "2024-12-18 16:00:00",
      purposeDescription: "例行检查",
      contact: "13900139000"
    }
  }
];

// 获取审批记录列表
const fetchApprovalResults = async () => {
  loading.value = true;
  try {
    // 实际项目中这里调用真实API
    // const res = await getApprovalResults({ pageNum: 1, pageSize: 10 })
    // tableData.value = res.data.list

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    tableData.value = mockData;
  } catch (error) {
    console.error("获取审批记录失败:", error);
    ElMessage.error("获取审批记录失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchApprovalResults();
});
</script>

<template>
  <div class="approval-records">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">审批记录</span>
          <el-button type="primary" @click="fetchApprovalResults"
            >刷新</el-button
          >
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="applicantName" label="申请人" min-width="100" />
        <el-table-column prop="approvalResult" label="审批结果" min-width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.approvalResult === '通过' ? 'success' : 'danger'"
            >
              {{ row.approvalResult }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="approvalRemarks"
          label="审批意见"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="createdAt" label="创建时间" min-width="150" />
        <el-table-column label="操作" min-width="100">
          <template #default="{ row }">
            <view-button :record-data="row" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped></style>
