// src/views/access/components/approval/ApproveButton.vue
<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import type { ProcessApprovalRequest } from "@/api/types";

const props = defineProps<{
  requestId: number;
}>();

const emit = defineEmits(["complete"]);

const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

const form = reactive<ProcessApprovalRequest & { needRemarks: boolean }>({
  requestId: props.requestId,
  approvalResult: "",
  approvalRemarks: "",
  needRemarks: false
});

const rules: FormRules = {
  approvalResult: [
    { required: true, message: "请选择审批结果", trigger: "change" }
  ],
  approvalRemarks: [
    {
      validator: (rule, value, callback) => {
        if (form.needRemarks && !value) {
          callback(new Error("驳回时必须填写审批意见"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

const handleApprovalResultChange = (result: string) => {
  form.needRemarks = result === "驳回";
  form.approvalRemarks = "";
};

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        // 实际项目中调用真实API
        // await processApproval({
        //   requestId: form.requestId,
        //   approvalResult: form.approvalResult,
        //   approvalRemarks: form.approvalRemarks
        // })
        await new Promise(resolve => setTimeout(resolve, 500));
        ElMessage.success("审批成功");
        dialogVisible.value = false;
        emit("complete");
      } catch (error) {
        console.error("审批失败:", error);
        ElMessage.error("审批失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

const resetForm = () => {
  form.approvalResult = "";
  form.approvalRemarks = "";
  form.needRemarks = false;
};
</script>

<template>
  <el-button type="warning" @click="dialogVisible = true"> 审批 </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="审批处理"
    width="500px"
    :append-to-body="true"
    :z-index="2000"
    destroy-on-close
    @closed="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="审批结果" prop="approvalResult">
        <el-radio-group
          v-model="form.approvalResult"
          @change="handleApprovalResultChange"
        >
          <el-radio label="通过">通过</el-radio>
          <el-radio label="驳回">驳回</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="审批意见" prop="approvalRemarks">
        <el-input
          v-model="form.approvalRemarks"
          type="textarea"
          :rows="4"
          :placeholder="
            form.needRemarks
              ? '请输入审批意见（驳回时必填）'
              : '请输入审批意见（选填）'
          "
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
