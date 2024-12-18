<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { PendingApproval } from "@/api/types";
import ViewButton from "./components/ViewButton.vue";
import ApproveButton from "./components/ApproveButton.vue";

const tableData = ref<PendingApproval[]>([]);
const loading = ref(false);

// 模拟数据
const mockData: PendingApproval[] = [
  {
    requestId: 1,
    applicantName: "张三",
    contact: "13800138000",
    roomName: "机房A",
    requestType: "临时访问",
    visitPurpose: "设备维护",
    plannedEntryTime: "2024-12-18 10:00:00",
    plannedExitTime: "2024-12-18 11:00:00",
    purposeDescription: "更换服务器硬盘"
  },
  {
    requestId: 2,
    applicantName: "李四",
    contact: "13900139000",
    roomName: "机房B",
    requestType: "常规访问",
    visitPurpose: "日常巡检",
    plannedEntryTime: "2024-12-18 14:00:00",
    plannedExitTime: "2024-12-18 15:00:00",
    purposeDescription: "例行设备检查"
  }
];

// 获取待审批列表
const fetchPendingApprovals = async () => {
  loading.value = true;
  try {
    // 实际项目中这里调用真实API
    // const res = await getPendingApprovals({ pageNum: 1, pageSize: 10 })
    // tableData.value = res.data.list

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    tableData.value = mockData;
  } catch (error) {
    console.error("获取待审批列表失败:", error);
    ElMessage.error("获取待审批列表失败");
  } finally {
    loading.value = false;
  }
};

// 处理审批结果
const handleApprovalComplete = () => {
  fetchPendingApprovals();
};

onMounted(() => {
  fetchPendingApprovals();
});
</script>

<template>
  <div class="my-approvals">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">待审批列表</span>
          <el-button type="primary" @click="fetchPendingApprovals"
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
        <el-table-column prop="contact" label="联系电话" min-width="120" />
        <el-table-column prop="roomName" label="机房名称" min-width="120" />
        <el-table-column prop="requestType" label="申请类型" min-width="100" />
        <el-table-column prop="visitPurpose" label="进出目的" min-width="120" />
        <el-table-column
          prop="plannedEntryTime"
          label="预计进入时间"
          min-width="150"
        >
          <template #default="{ row }">
            {{ row.plannedEntryTime?.substring(0, 16) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="plannedExitTime"
          label="预计离开时间"
          min-width="150"
        >
          <template #default="{ row }">
            {{ row.plannedExitTime?.substring(0, 16) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120">
          <template #default="{ row }">
            <div class="flex gap-2">
              <view-button :request-data="row" />
              <approve-button
                :request-id="row.requestId"
                @complete="handleApprovalComplete"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.my-approvals {
  padding: 1.5rem;
}
</style>
