# Dashboard.vue
<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20">
      <el-col v-for="(item, index) in statistics" :key="index" :span="6">
        <el-card shadow="hover" class="statistics-card">
          <div class="card-content">
            <el-icon :size="40" :class="item.iconClass">
              <component :is="item.icon" />
            </el-icon>
            <div class="card-info">
              <p class="label">{{ item.label }}</p>
              <p class="value">{{ item.value }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-container">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>访问趋势</span>
            </div>
          </template>
          <div ref="visitChartRef" class="chart" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>审批状态分布</span>
            </div>
          </template>
          <div ref="approvalChartRef" class="chart" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw, onUnmounted } from "vue";
import { House, User, Timer, Document } from "@element-plus/icons-vue";
import type { EChartsType } from "echarts/core";
import * as echarts from "echarts";

// DOM引用
const visitChartRef = ref<HTMLElement>();
const approvalChartRef = ref<HTMLElement>();
// 图表实例引用
const visitChart = ref<EChartsType>();
const approvalChart = ref<EChartsType>();

// 统计数据
const statistics = ref([
  {
    label: "机房总数",
    value: 12,
    icon: markRaw(House),
    iconClass: "icon-blue"
  },
  {
    label: "今日访问",
    value: 25,
    icon: markRaw(User),
    iconClass: "icon-green"
  },
  {
    label: "待审批",
    value: 5,
    icon: markRaw(Timer),
    iconClass: "icon-orange"
  },
  {
    label: "已审批",
    value: 18,
    icon: markRaw(Document),
    iconClass: "icon-purple"
  }
]);

// 初始化访问趋势图表
const initVisitChart = () => {
  if (visitChartRef.value) {
    visitChart.value = echarts.init(visitChartRef.value);
    const option = {
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [12, 15, 8, 20, 16, 5, 3],
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#409EFF"
          },
          itemStyle: {
            color: "#409EFF"
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(64,158,255,0.3)"
              },
              {
                offset: 1,
                color: "rgba(64,158,255,0.1)"
              }
            ])
          }
        }
      ]
    };
    visitChart.value.setOption(option);
  }
};

// 初始化审批状态图表
const initApprovalChart = () => {
  if (approvalChartRef.value) {
    approvalChart.value = echarts.init(approvalChartRef.value);
    const option = {
      tooltip: {
        trigger: "item"
      },
      legend: {
        orient: "vertical",
        left: "left"
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {c} ({d}%)"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "16",
              fontWeight: "bold"
            }
          },
          data: [
            {
              value: 18,
              name: "已审批",
              itemStyle: { color: "#67C23A" }
            },
            {
              value: 5,
              name: "待审批",
              itemStyle: { color: "#E6A23C" }
            }
          ]
        }
      ]
    };
    approvalChart.value.setOption(option);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  visitChart.value?.resize();
  approvalChart.value?.resize();
};

onMounted(() => {
  initVisitChart();
  initApprovalChart();
  window.addEventListener("resize", handleResize);
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  visitChart.value?.dispose();
  approvalChart.value?.dispose();
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.statistics-card {
  margin-bottom: 20px;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-info {
  flex-grow: 1;
}

.card-info .label {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.card-info .value {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0 0;
}

.chart-container {
  margin-top: 20px;
}

.chart {
  height: 300px;
}

.icon-blue {
  color: #409eff;
}

.icon-green {
  color: #67c23a;
}

.icon-orange {
  color: #e6a23c;
}

.icon-purple {
  color: #909399;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}
</style>
