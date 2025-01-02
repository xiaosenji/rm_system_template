<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import type { AccessCreateRequest } from "@/api/types";
import { purposes } from "@/views/request/CreateRequest/config/purpose";
import { useUserStore } from "@/store/modules/user";
import dayjs from "dayjs";

// 添加props定义，接收路由参数
const props = defineProps<{
  roomRegion?: string;
  roomCenter?: string;
  roomId?: number | null;
  roomName?: string;
}>();

const route = useRoute();
const userStore = useUserStore();
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

// 机房名称远程搜索
const handleRoomSearch = async (query: string) => {
  if (!form.roomRegion || !form.roomCenter) return;

  try {
    // 实际项目中调用真实API
    // const response = await getRoomList({
    //   roomRegion: form.roomRegion,
    //   roomCenter: form.roomCenter,
    //   roomName: query
    // });
    // roomList.value = response.data.list;

    // 模拟数据
    roomList.value = [
      { id: 1, name: "机房A" },
      { id: 2, name: "机房B" },
      { id: 3, name: "机房C" }
    ].filter(room => room.name.includes(query));
  } catch (error) {
    console.error("获取机房列表失败:", error);
    ElMessage.error("获取机房列表失败");
  }
};

// 设置此刻时间
const setCurrentTime = (type: "entry" | "exit") => {
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  if (type === "entry") {
    form.plannedEntryTime = currentTime;
  } else {
    form.plannedExitTime = currentTime;
  }
};

// 重置表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
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
        ElMessage.success("创建成功");
        handleReset();
      } catch (error) {
        console.error("创建失败:", error);
        ElMessage.error("创建失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

// 在页面加载时自动填充扫码数据
onMounted(async () => {
  // 从 URL 获取参数
  const { region, center, roomId, roomName } = route.query;

  if (region && center && roomId) {
    // 填充区县和获取支撑中心列表
    form.roomRegion = region as string;
    centerList.value = mockCenterMap[region as string] || [];

    // 填充支撑中心
    form.roomCenter = center as string;

    // 填充机房信息
    form.roomId = Number(roomId);
    if (roomId && roomName) {
      roomList.value = [
        {
          id: Number(roomId),
          name: roomName as string
        }
      ];
    }

    // 设置时间：进入时间为当前时间，离开时间为8小时后
    const now = dayjs();
    form.plannedEntryTime = now.format("YYYY-MM-DD HH:mm:ss");
    form.plannedExitTime = now.add(5, "minute").format("YYYY-MM-DD HH:mm:ss");
  }
});
</script>

<template>
  <div class="create-request">
    <el-card class="mb-4">
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

        <el-form-item label="机房名称" prop="roomId">
          <el-select
            v-model="form.roomId"
            placeholder="请选择机房"
            class="w-full"
            :disabled="!form.roomCenter"
            filterable
            remote
            :remote-method="handleRoomSearch"
          >
            <el-option
              v-for="room in roomList"
              :key="room.id"
              :label="room.name"
              :value="room.id"
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
          <div class="flex items-center gap-4">
            <el-date-picker
              v-model="form.plannedEntryTime"
              type="datetime"
              placeholder="选择日期时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :disabled-time="disabledTime"
            />
            <el-button @click="setCurrentTime('entry')">此刻</el-button>
          </div>
        </el-form-item>

        <el-form-item label="预计离开时间" prop="plannedExitTime">
          <div class="flex items-center gap-4">
            <el-date-picker
              v-model="form.plannedExitTime"
              type="datetime"
              placeholder="选择日期时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :disabled-time="disabledTime"
            />
            <el-button @click="setCurrentTime('exit')">此刻</el-button>
          </div>
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

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit(formRef)"
          >
            提交
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped></style>
