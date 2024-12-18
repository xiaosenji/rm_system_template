<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { AccessRecord } from "@/api/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const tableData = ref<AccessRecord[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 获取访问状态
const getAccessStatus = (record: AccessRecord): "正常进出" | "异常进出" => {
  if (!record.visitTime) {
    return "异常进出";
  }
  const visitTime = dayjs(record.visitTime);
  const plannedEntryTime = dayjs(record.plannedEntryTime);
  const plannedExitTime = dayjs(record.plannedExitTime);

  return visitTime.isBetween(plannedEntryTime, plannedExitTime, null, "[]")
    ? "正常进出"
    : "异常进出";
};

// 模拟数据
const mockData: AccessRecord[] = [
  {
    recordId: 1,
    approvalId: 101,
    requestId: 1001,
    visitTime: "2024-12-18 10:30:00", // 在预计时间区间内进入
    applicantName: "张三",
    roomName: "机房A",
    requestType: "临时访问",
    visitPurpose: "设备维护",
    plannedEntryTime: "2024-12-18 10:00:00",
    plannedExitTime: "2024-12-18 11:00:00",
    accessStatus: "正常进出"
  },
  {
    recordId: 2,
    approvalId: 102,
    requestId: 1002,
    visitTime: null, // 超出预计时间未进入
    applicantName: "李四",
    roomName: "机房B",
    requestType: "常规访问",
    visitPurpose: "日常巡检",
    plannedEntryTime: "2024-12-18 15:00:00",
    plannedExitTime: "2024-12-18 16:00:00",
    accessStatus: "异常进出"
  }
];

// 获取进门记录列表
const fetchAccessRecords = async () => {
  loading.value = true;
  try {
    // 实际项目中这里调用真实API
    // const res = await getAccessRecords({
    //   pageNum: currentPage.value,
    //   pageSize: pageSize.value
    // })
    // tableData.value = res.data.list
    // total.value = res.data.total

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    tableData.value = mockData;
    total.value = mockData.length;
  } catch (error) {
    console.error("获取进门记录失败:", error);
    ElMessage.error("获取进门记录失败");
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchAccessRecords();
};

// 日期格式化
const formatDateTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};

onMounted(() => {
  fetchAccessRecords();
});
</script>

<template>
  <div class="access-records">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">进门记录</span>
          <el-button type="primary" @click="fetchAccessRecords">刷新</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="applicantName" label="申请人" min-width="100" />
        <el-table-column prop="roomName" label="机房名称" min-width="120" />
        <el-table-column prop="requestType" label="申请类型" min-width="100" />
        <el-table-column
          prop="visitPurpose"
          label="进出目的"
          min-width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="plannedEntryTime"
          label="预计进入时间"
          min-width="160"
        >
          <template #default="{ row }">
            {{ formatDateTime(row.plannedEntryTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="plannedExitTime"
          label="预计离开时间"
          min-width="160"
        >
          <template #default="{ row }">
            {{ formatDateTime(row.plannedExitTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="visitTime" label="实际进入时间" min-width="160">
          <template #default="{ row }">
            {{ row.visitTime ? formatDateTime(row.visitTime) : "未进入" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="accessStatus"
          label="进出状态"
          min-width="100"
          fixed="right"
        >
          <template #default="{ row }">
            <el-tag
              :type="getAccessStatus(row) === '正常进出' ? 'success' : 'danger'"
            >
              {{ getAccessStatus(row) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.access-records {
  padding: 1.5rem;
}
</style>
