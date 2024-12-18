// src/views/access/components/AccessCodeButton.vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as QRCode from "qrcode";

const props = defineProps<{
  accessCode?: string;
}>();

const dialogVisible = ref(false);
const qrCodeUrl = ref("");

const generateQRCode = async () => {
  try {
    if (props.accessCode) {
      const url = await QRCode.toDataURL(props.accessCode, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: "H"
      });
      qrCodeUrl.value = url;
    }
  } catch (err) {
    console.error("生成二维码失败:", err);
  }
};

onMounted(() => {
  generateQRCode();
});
</script>

<template>
  <el-button type="success" @click="dialogVisible = true"> 通行证 </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="通行证二维码"
    width="300px"
    align-center
    :append-to-body="true"
    :z-index="2000"
    destroy-on-close
  >
    <div class="flex flex-col items-center gap-4">
      <img
        v-if="qrCodeUrl"
        :src="qrCodeUrl"
        alt="Access QR Code"
        class="w-[200px] h-[200px]"
      />
      <p v-if="!qrCodeUrl" class="text-gray-400">生成二维码中...</p>
      <p class="text-gray-600">访问码: {{ accessCode }}</p>
    </div>
  </el-dialog>
</template>
