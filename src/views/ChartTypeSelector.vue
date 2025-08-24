<template>
  <div class="chart-type-selector">
    <div class="selector-header">
      <h3>选择图表类型</h3>
      <p>点击下方图标选择适合的图表类型</p>
    </div>
    
    <div class="chart-types-grid">
      <div 
        v-for="chartType in chartTypes" 
        :key="chartType.type"
        class="chart-type-item"
        :class="{ 'selected': selectedType === chartType.type }"
        @click="selectChartType(chartType.type)"
      >
        <div class="chart-icon">{{ chartType.icon }}</div>
        <div class="chart-info">
          <h4>{{ chartType.name }}</h4>
          <p>{{ chartType.description }}</p>
        </div>
        <div class="chart-examples">
          <span v-for="example in chartType.examples" :key="example" class="example-tag">
            {{ example }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="selector-footer">
      <el-button @click="confirmSelection" type="primary" size="large" :disabled="!selectedType">
        确认选择
      </el-button>
      <el-button @click="cancelSelection" size="large">
        取消
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'cancel'])

const selectedType = ref('')

const chartTypes = [
  {
    type: 'line',
    icon: '📈',
    name: '折线图',
    description: '展示数据随时间变化的趋势',
    examples: ['销售趋势', '温度变化', '股票走势']
  },
  {
    type: 'bar',
    icon: '📊',
    name: '柱状图',
    description: '比较不同类别的数值大小',
    examples: ['产品销量', '地区收入', '部门人数']
  },
  {
    type: 'pie',
    icon: '🥧',
    name: '饼图',
    description: '展示整体中各部分的占比',
    examples: ['市场份额', '收入构成', '用户分布']
  },
  {
    type: 'area',
    icon: '📊',
    name: '面积图',
    description: '强调数据变化的幅度和趋势',
    examples: ['收入趋势', '人口变化', '资源消耗']
  },
  {
    type: 'radar',
    icon: '🎯',
    name: '雷达图',
    description: '多维度数据的对比分析',
    examples: ['能力评估', '产品对比', '绩效分析']
  },
  {
    type: 'scatter',
    icon: '🔍',
    name: '散点图',
    description: '展示两个变量之间的关系',
    examples: ['身高体重', '价格销量', '年龄收入']
  },
  {
    type: 'funnel',
    icon: '🫖',
    name: '漏斗图',
    description: '展示业务流程中的转化情况',
    examples: ['销售漏斗', '用户转化', '注册流程']
  },
  {
    type: 'gauge',
    icon: '⏱️',
    name: '仪表盘',
    description: '展示单一指标的完成程度',
    examples: ['完成率', '满意度', '达成率']
  },
  {
    type: 'tree',
    icon: '🌳',
    name: '树图',
    description: '展示层级结构关系',
    examples: ['组织架构', '产品分类', '文件目录']
  },
  {
    type: 'treemap',
    icon: '🗺️',
    name: '矩形树图',
    description: '展示层级数据的面积占比',
    examples: ['磁盘使用', '预算分配', '市场份额']
  },
  {
    type: 'sunburst',
    icon: '☀️',
    name: '旭日图',
    description: '展示多层级数据的环形结构',
    examples: ['产品分类', '地区分布', '用户画像']
  },
  {
    type: 'heatmap',
    icon: '🔥',
    name: '热力图',
    description: '展示二维数据的密度分布',
    examples: ['访问热图', '温度分布', '人口密度']
  }
]

function selectChartType(type) {
  selectedType.value = type
}

function confirmSelection() {
  if (selectedType.value) {
    emit('select', selectedType.value)
  }
}

function cancelSelection() {
  emit('cancel')
}
</script>

<style scoped>
.chart-type-selector {
  padding: 20px;
}

.selector-header {
  text-align: center;
  margin-bottom: 30px;
}

.selector-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.selector-header p {
  color: var(--text-secondary);
  margin: 0;
}

.chart-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.chart-type-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px var(--shadow-color);
  border-color: var(--accent-color);
}

.chart-type-item.selected {
  border-color: var(--accent-color);
  background: rgba(102, 126, 234, 0.1);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.chart-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.chart-info h4 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-info p {
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.chart-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}

.example-tag {
  background: var(--accent-color);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.selector-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-types-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-type-item {
    padding: 15px;
  }
  
  .chart-icon {
    font-size: 2.5rem;
  }
}
</style>
