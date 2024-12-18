<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { AccessRequest } from "@/api/types";
import ViewButton from "./components/ViewButton.vue";
import EditButton from "./components/EditButton.vue";
import CancelButton from "./components/CancelButton.vue";
import AccessCodeButton from "./components/AccessCodeButton.vue";
import RemarksButton from "./components/RemarksButton.vue";

const tableData = ref<AccessRequest[]>([]);
const loading = ref(false);

// 模拟数据
const mockData: AccessRequest[] = [
  {
    requestId: 1,
    applicantName: "张三",
    contact: "13800138000",
    roomName: "机房A",
    requestType: "临时访问",
    visitPurpose: "设备维护",
    plannedEntryTime: "2024-12-18 10:00:00",
    plannedExitTime: "2024-12-18 11:00:00",
    requestStatus: "待审批",
    purposeDescription: "需要更换服务器硬盘",
    approvalRemarks: ""
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
    requestStatus: "已通过",
    purposeDescription: "日常巡检设备运行状况",
    accessCode: "ABC123"
  },
  {
    requestId: 3,
    applicantName: "王五",
    contact: "13700137000",
    roomName: "机房C",
    requestType: "紧急访问",
    visitPurpose: "故障处理",
    plannedEntryTime: "2024-12-18 16:00:00",
    plannedExitTime: "2024-12-18 17:00:00",
    requestStatus: "已驳回",
    purposeDescription: "处理网络故障",
    approvalRemarks: "请提供更详细的访问说明"
  }
];

// 获取申请列表
const fetchRequests = async () => {
  loading.value = true;
  try {
    // 实际项目中这里调用真实API
    // const res = await getAccessList({ pageNum: 1, pageSize: 10 })
    // tableData.value = res.data.list

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    tableData.value = mockData;
  } catch (error) {
    console.error("获取申请列表失败:", error);
    ElMessage.error("获取申请列表失败");
  } finally {
    loading.value = false;
  }
};

// 处理申请取消
const handleCancel = async (requestId: number) => {
  try {
    // 实际项目中调用真实API
    // await cancelAccessRequest(requestId)
    await new Promise(resolve => setTimeout(resolve, 500));
    tableData.value = tableData.value.map(item => {
      if (item.requestId === requestId) {
        return { ...item, requestStatus: "已取消" };
      }
      return item;
    });
    ElMessage.success("申请已取消");
  } catch (error) {
    console.error("取消申请失败:", error);
    ElMessage.error("取消申请失败");
  }
};

onMounted(() => {
  fetchRequests();
});
</script>

<template>
  <div class="my-requests">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">我的申请</span>
          <el-button type="primary" @click="fetchRequests">刷新</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="applicantName" label="申请人" width="120" />
        <el-table-column prop="roomName" label="机房名称" width="120" />
        <el-table-column prop="requestType" label="申请类型" width="120" />
        <el-table-column prop="visitPurpose" label="进出目的" width="120" />
        <el-table-column prop="requestStatus" label="审批状态" width="120">
          <template #default="{ row }">
            <el-tag
              :type="
                row.requestStatus === '已通过'
                  ? 'success'
                  : row.requestStatus === '已驳回'
                    ? 'danger'
                    : row.requestStatus === '已取消'
                      ? 'info'
                      : 'warning'
              "
            >
              {{ row.requestStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <!-- 待审批状态 -->
              <template v-if="row.requestStatus === '待审批'">
                <view-button :request-data="row" />
                <edit-button :request-data="row" @refresh="fetchRequests" />
                <cancel-button
                  :request-id="row.requestId"
                  @cancel="handleCancel"
                />
              </template>

              <!-- 已通过状态 -->
              <template v-if="row.requestStatus === '已通过'">
                <access-code-button :access-code="row.accessCode" />
              </template>

              <!-- 已驳回状态 -->
              <template v-if="row.requestStatus === '已驳回'">
                <remarks-button :remarks="row.approvalRemarks" />
                <edit-button :request-data="row" @refresh="fetchRequests" />
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped></style>
