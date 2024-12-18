// src/views/access/components/EditButton.vue
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import type { AccessRequest, AccessCreateRequest } from "@/api/types";
import { purposes } from "@/views/request/CreateRequest/config/purpose";
import { useUserStore } from "@/store/modules/user";
import dayjs from "dayjs";

const props = defineProps<{
  requestData: AccessRequest;
}>();

const emit = defineEmits(["refresh"]);
const userStore = useUserStore();

const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

// 模拟数据，实际项目中应该通过API获取
const mockRegions = ["海淀区", "朝阳区", "丰台区", "石景山区", "通州区"];
const mockCenterMap = {
  海淀区: ["海淀第一中心", "海淀第二中心", "海淀第三中心"],
  朝阳区: ["朝阳第一中心", "朝阳第二中心"],
  丰台区: ["丰台第一中心", "丰台第二中心"],
  石景山区: ["石景山第一中心"],
  通州区: ["通州第一中心", "通州第二中心"]
};
const requestTypes = ["常规进出", "紧急进出"];
const centerList = ref<string[]>([]);
const roomList = ref<{ id: number; name: string }[]>([]);

interface FormType extends Omit<AccessCreateRequest, "roomId"> {
  roomId: number | null;
  roomRegion: string;
  roomCenter: string;
}

const form = reactive<FormType>({
  roomId: null,
  roomRegion: "",
  roomCenter: "",
  contact: "",
  requestType: "",
  visitPurpose: "",
  plannedEntryTime: "",
  plannedExitTime: "",
  purposeDescription: ""
});

const rules: FormRules = {
  contact: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  roomRegion: [
    { required: true, message: "请选择所属区县", trigger: "change" }
  ],
  roomCenter: [
    { required: true, message: "请选择支撑中心", trigger: "change" }
  ],
  roomId: [{ required: true, message: "请选择机房", trigger: "change" }],
  requestType: [
    { required: true, message: "请选择进出类型", trigger: "change" }
  ],
  visitPurpose: [
    { required: true, message: "请选择进出目的", trigger: "change" }
  ],
  plannedEntryTime: [
    { required: true, message: "请选择预计进入时间", trigger: "change" }
  ],
  plannedExitTime: [
    { required: true, message: "请选择预计离开时间", trigger: "change" }
  ]
};

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
};

const disabledTime = (date: Date) => {
  const now = new Date();
  if (dayjs(date).format("YYYY-MM-DD") === dayjs(now).format("YYYY-MM-DD")) {
    return {
      hours: Array.from({ length: now.getHours() }, (_, i) => i),
      minutes:
        date.getHours() === now.getHours()
          ? Array.from({ length: now.getMinutes() }, (_, i) => i)
          : []
    };
  }
  return {
    hours: [],
    minutes: []
  };
};

const handleRegionChange = (region: string) => {
  form.roomCenter = "";
  form.roomId = null;
  centerList.value = mockCenterMap[region] || [];
};

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        // 实际项目中调用真实API
        // await createAccessRequest(form)
        await new Promise(resolve => setTimeout(resolve, 500));
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        emit("refresh");
      } catch (error) {
        console.error("修改失败:", error);
        ElMessage.error("修改失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

onMounted(() => {
  // 初始化表单数据
  Object.assign(form, {
    contact: props.requestData.contact,
    requestType: props.requestData.requestType,
    visitPurpose: props.requestData.visitPurpose,
    plannedEntryTime: props.requestData.plannedEntryTime,
    plannedExitTime: props.requestData.plannedExitTime,
    purposeDescription: props.requestData.purposeDescription
  });
});

// 监听对话框打开，重置表单
const handleDialogOpen = () => {
  if (form.roomRegion) {
    centerList.value = mockCenterMap[form.roomRegion] || [];
  }
};
</script>

<template>
  <el-button type="warning" @click="dialogVisible = true"> 修改 </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="修改申请"
    width="600px"
    :append-to-body="true"
    :z-index="2000"
    destroy-on-close
    @open="handleDialogOpen"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="max-w-3xl"
    >
      <el-form-item label="申请人">
        <el-input :value="userStore.nickname" disabled />
      </el-form-item>

      <el-form-item label="联系电话" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入联系电话" />
      </el-form-item>

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

      <el-form-item label="进出类型" prop="requestType">
        <el-select
          v-model="form.requestType"
          placeholder="请选择进出类型"
          class="w-full"
        >
          <el-option
            v-for="type in requestTypes"
            :key="type"
            :label="type"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="进出目的" prop="visitPurpose">
        <el-select
          v-model="form.visitPurpose"
          placeholder="请选择进出目的"
          class="w-full"
        >
          <el-option
            v-for="purpose in purposes"
            :key="purpose.value"
            :label="purpose.label"
            :value="purpose.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="预计进入时间" prop="plannedEntryTime">
        <el-date-picker
          v-model="form.plannedEntryTime"
          type="datetime"
          placeholder="选择日期时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="disabledDate"
          :disabled-time="disabledTime"
        />
      </el-form-item>

      <el-form-item label="预计离开时间" prop="plannedExitTime">
        <el-date-picker
          v-model="form.plannedExitTime"
          type="datetime"
          placeholder="选择日期时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="disabledDate"
          :disabled-time="disabledTime"
        />
      </el-form-item>

      <el-form-item label="进出目的详述" prop="purposeDescription">
        <el-input
          v-model="form.purposeDescription"
          type="textarea"
          :rows="4"
          placeholder="请输入进出目的详述（最多200字）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit(formRef)"
      >
        确认
      </el-button>
    </template>
  </el-dialog>
</template>
