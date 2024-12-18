<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import type { RoomCreateRequest } from "@/api/types";

// 模拟数据
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
  ],
  丰台区: [
    { userId: 1005, nickname: "钱七", tel: "13800138005" },
    { userId: 1006, nickname: "孙八", tel: "13800138006" }
  ],
  石景山区: [
    { userId: 1007, nickname: "周九", tel: "13800138007" },
    { userId: 1008, nickname: "吴十", tel: "13800138008" }
  ],
  通州区: [
    { userId: 1009, nickname: "郑十一", tel: "13800138009" },
    { userId: 1010, nickname: "王十二", tel: "13800138010" }
  ]
};

const formRef = ref<FormInstance>();
const form = reactive<RoomCreateRequest>({
  roomRegion: "",
  roomCenter: "",
  roomName: "",
  managerName: "",
  managerPhone: "",
  backupManagerName: "",
  backupManagerPhone: "",
  remarks: ""
});

// 列表数据
const centerList = ref<string[]>([]);
const managerList = ref<{ userId: number; nickname: string; tel: string }[]>(
  []
);

// 表单校验规则
const rules = reactive<FormRules>({
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
  backupManagerName: [],
  backupManagerPhone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ]
});

// 区县变更处理
const handleRegionChange = (region: string) => {
  form.roomCenter = "";
  form.managerName = "";
  form.backupManagerName = "";
  form.managerPhone = "";
  form.backupManagerPhone = "";

  centerList.value = mockCenterMap[region] || [];
  managerList.value = mockManagerMap[region] || [];
};

// 机房长选择变更时自动填充电话
const handleManagerChange = (isBackup: boolean = false) => {
  const selectedManager = managerList.value.find(
    m => m.nickname === (isBackup ? form.backupManagerName : form.managerName)
  );
  if (selectedManager) {
    if (isBackup) {
      form.backupManagerPhone = selectedManager.tel;
    } else {
      form.managerPhone = selectedManager.tel;
    }
  }
};

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(valid => {
    if (valid) {
      console.log("提交的表单数据:", form);
      ElMessage.success("创建成功");
      formEl.resetFields();
    }
  });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <div class="room-create">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="text-xl font-medium">创建机房</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="max-w-3xl"
      >
        <el-form-item label="所属区县" prop="roomRegion">
          <el-select
            v-model="form.roomRegion"
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
            v-model="form.roomCenter"
            placeholder="请选择支撑中心"
            class="w-full"
            :disabled="!form.roomRegion"
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
          <el-input v-model="form.roomName" placeholder="请输入机房名称" />
        </el-form-item>

        <el-form-item label="机房长" prop="managerName">
          <el-select
            v-model="form.managerName"
            placeholder="请选择机房长"
            class="w-full"
            :disabled="!form.roomRegion"
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
            v-model="form.managerPhone"
            placeholder="请输入机房长联系电话"
            :disabled="!form.managerName"
          />
        </el-form-item>

        <el-form-item label="备用机房长" prop="backupManagerName">
          <el-select
            v-model="form.backupManagerName"
            placeholder="请选择备用机房长"
            class="w-full"
            :disabled="!form.roomRegion"
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
            v-model="form.backupManagerPhone"
            placeholder="请输入备用机房长联系电话"
            :disabled="!form.backupManagerName"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)"
            >创建</el-button
          >
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
