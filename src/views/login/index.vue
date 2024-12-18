<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter, useRoute } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";

defineOptions({
  name: "Login"
});

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  username: "admin",
  password: "admin123"
});

// 默认的首页路径
const DEFAULT_HOME = "/"; // 修改为你项目的实际首页路径

// 解析重定向信息
const getRedirectInfo = () => {
  try {
    // 获取重定向路径
    const redirectPath = route.query.redirect as string;
    console.log("重定向路径:", redirectPath);

    if (!redirectPath) {
      console.log("没有重定向路径，返回首页");
      return {
        path: DEFAULT_HOME,
        query: {}
      };
    }

    // 将重定向路径解析为URL对象
    const url = new URL(redirectPath, window.location.origin);
    console.log("解析后的URL:", url);

    // 从URL中获取路径和查询参数
    const pathWithQuery = url.hash ? url.hash.slice(1) : url.pathname;
    const searchParams = new URLSearchParams(url.search);

    // 构建查询参数对象
    const query = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    console.log("提取的路径:", pathWithQuery);
    console.log("提取的参数:", query);

    return {
      path: pathWithQuery,
      query
    };
  } catch (error) {
    console.error("解析重定向信息失败:", error);
    return {
      path: DEFAULT_HOME,
      query: {}
    };
  }
};

// 获取重定向信息
const redirectInfo = getRedirectInfo();
console.log("重定向信息:", redirectInfo);

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password
        })
        .then(res => {
          if (res.success) {
            // 获取后端路由
            return initRouter().then(() => {
              console.log("准备跳转到:", redirectInfo);
              // 使用保存的重定向信息进行跳转
              router
                .push(redirectInfo)
                .then(() => {
                  message("登录成功", { type: "success" });
                })
                .catch(error => {
                  console.error("路由跳转失败:", error);
                  message("登录成功，但跳转失败", { type: "warning" });
                  // 跳转失败时使用默认路由
                  router.push(DEFAULT_HOME);
                });
            });
          } else {
            message("登录失败", { type: "error" });
          }
        })
        .catch(error => {
          console.error("登录失败:", error);
          message("登录发生错误", { type: "error" });
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
  console.log("当前路由参数:", route.query);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
