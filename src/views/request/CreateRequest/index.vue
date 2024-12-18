<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { AccessRequest } from "@/api/types";
import ViewButton from "./components/ViewButton.vue";
import EditButton from "./components/EditButton.vue";
import CancelButton from "./components/CancelButton.vue";
import AccessCodeButton from "./components/AccessCodeButton.vue";
import RemarksButton from "./components/RemarksButton.vue";
import { ElMessage } from "element-plus";

const tableData = ref<AccessRequest[]>([]);
const loading = ref(false);

// 模拟数据
const mockData: AccessRequest[] = [
  {
    requestId: 1,
    applicantName: "张三",
    contact: "",
    roomName: "机房A",
    requestType: "临时访问",
    visitPurpose: "设备维护",
    plannedEntryTime: "",
    plannedExitTime: "",
    requestStatus: "待审批",
    approvalRemarks: ""
  },
  {
    requestId: 2,
    applicantName: "李四",
    contact: "",
    roomName: "机房B",
    requestType: "常规访问",
    visitPurpose: "日常巡检",
    plannedEntryTime: "",
    plannedExitTime: "",
    requestStatus: "已通过",
    accessCode: "ABC123"
  },
  {
    requestId: 3,
    applicantName: "王五",
    contact: "",
    roomName: "机房C",
    requestType: "紧急访问",
    visitPurpose: "故障处理",
    plannedEntryTime: "",
    plannedExitTime: "",
    requestStatus: "已驳回",
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
        <el-table-column prop="requestStatus" label="审批状态" width="120" />
        <el-table-column label="操作" min-width="200">
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
