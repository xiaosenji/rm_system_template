<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessageBox, ElMessage } from "element-plus";
import QRCode from "qrcode";
import type { RoomDetail, RoomCreateRequest } from "@/api/types";

// 模拟数据
const mockRoomList: RoomDetail[] = [
  {
    roomId: 1,
    roomRegion: "海淀区",
    roomCenter: "海淀第一中心",
    roomName: "海淀机房1号",
    managerName: "张三",
    backupManagerName: "李四",
    lockDeviceFlag: false,
    managerPhone: "13800138001",
    backupManagerPhone: "13800138002",
    remarks: "这是一个测试机房",
    createdAt: "2024-01-01 12:00:00",
    updatedAt: "2024-01-02 14:00:00",
    createdByName: "系统管理员",
    updatedByName: "系统管理员"
  },
  {
    roomId: 2,
    roomRegion: "朝阳区",
    roomCenter: "朝阳第一中心",
    roomName: "朝阳机房1号",
    managerName: "王五",
    backupManagerName: "",
    lockDeviceFlag: true,
    lockDeviceSn: "LOCK123456",
    managerPhone: "13800138003",
    backupManagerPhone: "",
    remarks: "备用机房",
    createdAt: "2024-01-03 09:00:00",
    updatedAt: "2024-01-03 09:00:00",
    createdByName: "系统管理员",
    updatedByName: "系统管理员"
  }
];

// 模拟区县和中心数据，复用创建页面的数据
const mockRegions = ["海淀区", "朝阳区", "丰台区", "石景山区", "通州区"];
const mockCenterMap = {
  海淀区: ["海淀第一中心", "海淀第二中心", "海淀第三中心"],
  朝阳区: ["朝阳第一中心", "朝阳第二中心"],
  丰台区: ["丰台第一中心", "丰台第二中心"],
  石景山区: ["石景山第一中心"],
  通州区: ["通州第一中心", "通州第二中心"]
};
const mockManagerMap = {
  海淀区: [
    { userId: 1001, nickname: "张三", tel: "13800138001" },
    { userId: 1002, nickname: "李四", tel: "13800138002" }
  ],
  朝阳区: [
    { userId: 1003, nickname: "王五", tel: "13800138003" },
    { userId: 1004, nickname: "赵六", tel: "13800138004" }
  ]
};

// 表格数据
const tableData = ref(mockRoomList);

// 详情对话框
const detailDialogVisible = ref(false);
const currentDetail = ref<RoomDetail | null>(null);

// 修改对话框
const editDialogVisible = ref(false);
const editFormRef = ref<FormInstance>();
const editForm = reactive<RoomCreateRequest>({
  roomRegion: "",
  roomCenter: "",
  roomName: "",
  managerName: "",
  managerPhone: "",
  backupManagerName: "",
  backupManagerPhone: "",
  remarks: ""
});

// 门禁二维码对话框
const qrDialogVisible = ref(false);
const qrCodeUrl = ref("");
const currentRoomName = ref("");

// 编辑相关数据
const centerList = ref<string[]>([]);
const managerList = ref<{ userId: number; nickname: string; tel: string }[]>(
  []
);

// 验证规则
const rules = {
  roomRegion: [
    { required: true, message: "请选择所属区县", trigger: "change" }
  ],
  roomCenter: [
    { required: true, message: "请选择支撑中心", trigger: "change" }
  ],
  roomName: [{ required: true, message: "请输入机房名称", trigger: "blur" }],
  managerName: [{ required: true, message: "请选择机房长", trigger: "change" }],
  managerPhone: [
    { required: true, message: "请输入机房长联系电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  backupManagerPhone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ]
};

// 查看详情
const handleView = (row: RoomDetail) => {
  currentDetail.value = row;
  detailDialogVisible.value = true;
};

// 显示门禁配置二维码
const handleConfigLock = async (row: RoomDetail) => {
  currentRoomName.value = row.roomName;
  // 生成包含房间信息的二维码数据
  const qrData = JSON.stringify({
    roomId: row.roomId,
    roomName: row.roomName,
    timestamp: new Date().getTime()
  });

  try {
    qrCodeUrl.value = await QRCode.toDataURL(qrData);
    qrDialogVisible.value = true;
  } catch (err) {
    console.error("生成二维码失败:", err);
    ElMessage.error("生成二维码失败");
  }
};

// 区县变更处理
const handleRegionChange = (region: string) => {
  editForm.roomCenter = "";
  editForm.managerName = "";
  editForm.backupManagerName = "";
  editForm.managerPhone = "";
  editForm.backupManagerPhone = "";

  centerList.value = mockCenterMap[region] || [];
  managerList.value = mockManagerMap[region] || [];
};

// 机房长选择变更时自动填充电话
const handleManagerChange = (isBackup: boolean = false) => {
  const selectedManager = managerList.value.find(
    m =>
      m.nickname ===
      (isBackup ? editForm.backupManagerName : editForm.managerName)
  );
  if (selectedManager) {
    if (isBackup) {
      editForm.backupManagerPhone = selectedManager.tel;
    } else {
      editForm.managerPhone = selectedManager.tel;
    }
  }
};

// 修改机房
const handleEdit = (row: RoomDetail) => {
  // 填充表单数据
  Object.assign(editForm, {
    roomRegion: row.roomRegion,
    roomCenter: row.roomCenter,
    roomName: row.roomName,
    managerName: row.managerName,
    managerPhone: row.managerPhone,
    backupManagerName: row.backupManagerName,
    backupManagerPhone: row.backupManagerPhone,
    remarks: row.remarks
  });

  // 初始化相关选项
  handleRegionChange(row.roomRegion);
  editDialogVisible.value = true;
};

// 提交修改
const submitEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(valid => {
    if (valid) {
      console.log("提交修改数据:", editForm);
      ElMessage.success("修改成功");
      editDialogVisible.value = false;
    }
  });
};

// 删除机房
const handleDelete = (row: RoomDetail) => {
  ElMessageBox.confirm(`确定要删除机房"${row.roomName}"吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      console.log("删除机房:", row.roomId);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      // 取消删除
    });
};
</script>

<template>
  <div class="room-list p-6">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="text-xl font-medium">机房列表</span>
        </div>
      </template>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="roomRegion" label="所属区县" />
        <el-table-column prop="roomCenter" label="网络支撑中心" />
        <el-table-column prop="roomName" label="机房名称" />
        <el-table-column prop="managerName" label="机房长" />
        <el-table-column prop="backupManagerName" label="备用机房长" />
        <el-table-column label="机房门锁" align="center">
          <template #default="{ row }">
            <template v-if="row.lockDeviceFlag">
              <span>{{ row.lockDeviceSn }}</span>
            </template>
            <template v-else>
              <el-button type="primary" @click="handleConfigLock(row)">
                配置门禁
              </el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)"
              >查看</el-button
            >
            <el-button type="primary" link @click="handleEdit(row)"
              >修改</el-button
            >
            <el-button type="danger" link @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="机房详情" width="600px">
      <template v-if="currentDetail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="所属区县">{{
            currentDetail.roomRegion
          }}</el-descriptions-item>
          <el-descriptions-item label="支撑中心">{{
            currentDetail.roomCenter
          }}</el-descriptions-item>
          <el-descriptions-item label="机房名称">{{
            currentDetail.roomName
          }}</el-descriptions-item>
          <el-descriptions-item label="机房长">{{
            currentDetail.managerName
          }}</el-descriptions-item>
          <el-descriptions-item label="机房长电话">{{
            currentDetail.managerPhone
          }}</el-descriptions-item>
          <el-descriptions-item label="备用机房长">{{
            currentDetail.backupManagerName || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="备用机房长电话">{{
            currentDetail.backupManagerPhone || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="门锁状态">
            {{
              currentDetail.lockDeviceFlag
                ? `已配置 (${currentDetail.lockDeviceSn})`
                : "未配置"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">{{
            currentDetail.remarks || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            currentDetail.createdAt
          }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{
            currentDetail.createdByName
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            currentDetail.updatedAt
          }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{
            currentDetail.updatedByName
          }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog v-model="editDialogVisible" title="修改机房" width="600px">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="所属区县" prop="roomRegion">
          <el-select
            v-model="editForm.roomRegion"
            placeholder="请选择所属区县"
            class="w-full"
            @change="handleRegionChange"
          >
            <el-option
              v-for="region in mockRegions"
              :key="region"
              :label="region"
              :value="region"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="支撑中心" prop="roomCenter">
          <el-select
            v-model="editForm.roomCenter"
            placeholder="请选择支撑中心"
            class="w-full"
            :disabled="!editForm.roomRegion"
          >
            <el-option
              v-for="center in centerList"
              :key="center"
              :label="center"
              :value="center"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="机房名称" prop="roomName">
          <el-input v-model="editForm.roomName" placeholder="请输入机房名称" />
        </el-form-item>

        <el-form-item label="机房长" prop="managerName">
          <el-select
            v-model="editForm.managerName"
            placeholder="请选择机房长"
            class="w-full"
            :disabled="!editForm.roomRegion"
            @change="() => handleManagerChange(false)"
          >
            <el-option
              v-for="manager in managerList"
              :key="manager.userId"
              :label="manager.nickname"
              :value="manager.nickname"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="机房长电话" prop="managerPhone">
          <el-input
            v-model="editForm.managerPhone"
            placeholder="请输入机房长联系电话"
            :disabled="!editForm.managerName"
          />
        </el-form-item>

        <el-form-item label="备用机房长" prop="backupManagerName">
          <el-select
            v-model="editForm.backupManagerName"
            placeholder="请选择备用机房长"
            class="w-full"
            :disabled="!editForm.roomRegion"
            @change="() => handleManagerChange(true)"
          >
            <el-option
              v-for="manager in managerList"
              :key="manager.userId"
              :label="manager.nickname"
              :value="manager.nickname"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备用机房长电话" prop="backupManagerPhone">
          <el-input
            v-model="editForm.backupManagerPhone"
            placeholder="请输入备用机房长联系电话"
            :disabled="!editForm.backupManagerName"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="editForm.remarks"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit(editFormRef)"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 门禁配置二维码对话框 -->
    <el-dialog
      v-model="qrDialogVisible"
      title="门禁配置二维码"
      width="400px"
      align-center
    >
      <div class="flex flex-col items-center">
        <h3 class="mb-4">{{ currentRoomName }}</h3>
        <img :src="qrCodeUrl" alt="门禁配置二维码" class="w-64 h-64" />
        <p class="mt-4 text-gray-500">请使用门禁配置APP扫描此二维码</p>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
