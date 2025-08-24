<template>
  <div class="chart-visualizer">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><TrendCharts /></el-icon>
        图表可视化
      </h1>
      <p class="page-subtitle">输入格式化的数据，快速生成专业图表</p>
    </div>

    <div class="main-content">
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>数据输入</h3>
          <div class="input-actions">
            <el-button @click="showChartTypeSelector" size="small" type="primary">
              <el-icon><TrendCharts /></el-icon>
              选择图表类型
            </el-button>
            <el-button @click="loadExample" size="small" type="info">
              <el-icon><Document /></el-icon>
              加载示例
            </el-button>
            <el-button @click="clearInput" size="small" type="warning">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>
        
        <el-input
          v-model="chartDataInput"
          type="textarea"
          :rows="12"
          placeholder="请输入图表数据，支持JSON格式..."
          class="data-input"
          @input="validateInput"
        />
        
        <div class="input-footer">
          <div class="validation-status">
            <el-icon v-if="isValid" class="valid-icon"><CircleCheck /></el-icon>
            <el-icon v-else-if="chartDataInput" class="invalid-icon"><CircleClose /></el-icon>
            <span v-if="chartDataInput" :class="isValid ? 'valid-text' : 'invalid-text'">
              {{ isValid ? '数据格式正确' : '数据格式错误' }}
            </span>
          </div>
          <el-button 
            type="primary" 
            size="large" 
            @click="generateChart"
            :disabled="!isValid || !chartDataInput"
            class="generate-btn"
          >
            <el-icon><MagicStick /></el-icon>
            生成图表
          </el-button>
        </div>
      </div>

      <!-- 图表显示区域 -->
      <div class="chart-section">
        <div class="chart-header">
          <h3>图表预览</h3>
          <div class="chart-actions" v-if="chartData">
            <el-dropdown @command="downloadChart" size="small" type="success">
              <el-button type="success">
                <el-icon><Download /></el-icon>
                下载图表
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="png">下载PNG图片</el-dropdown-item>
                  <el-dropdown-item command="svg">下载SVG图片</el-dropdown-item>
                  <el-dropdown-item command="json">下载JSON数据</el-dropdown-item>
                  <el-dropdown-item command="csv">下载CSV数据</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button @click="fullscreenChart" size="small" type="info">
              <el-icon><FullScreen /></el-icon>
              全屏查看
            </el-button>
          </div>
        </div>
        
        <div class="chart-container" ref="chartContainer">
          <div v-if="!chartData" class="chart-placeholder">
            <el-icon size="64"><TrendCharts /></el-icon>
            <p>输入数据后点击生成图表</p>
          </div>
          <div v-else class="chart-wrapper">
                         <v-chart 
               :option="chartOption" 
               :style="{ height: '500px' }"
               class="chart"
             />
            <div class="chart-info">
              <h4>{{ chartData.title }}</h4>
              <p v-if="chartData.subtitle">{{ chartData.subtitle }}</p>
              <p v-if="chartData.description" class="description">{{ chartData.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据格式说明 -->
    <div class="format-guide">
      <h3>数据格式说明</h3>
      <div class="format-examples">
        <div class="format-example">
          <div class="example-header">
            <h4>折线图</h4>
            <el-button @click="copyCode('line')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "line",
  "title": "销售趋势",
  "xAxis": {
    "name": "月份",
    "data": ["1月", "2月", "3月", "4月"]
  },
  "yAxis": {
    "name": "销售额"
  },
  "series": [{
    "name": "销售额",
    "data": [120, 132, 101, 134],
    "type": "line"
  }]
}</code></pre>
        </div>
        
        <div class="format-example">
          <div class="example-header">
            <h4>柱状图</h4>
            <el-button @click="copyCode('bar')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "bar",
  "title": "产品销量",
  "xAxis": {
    "name": "产品",
    "data": ["A", "B", "C", "D"]
  },
  "yAxis": {
    "name": "销量"
  },
  "series": [{
    "name": "销量",
    "data": [320, 332, 301, 334],
    "type": "bar"
  }]
}</code></pre>
        </div>
        
        <div class="format-example">
          <div class="example-header">
            <h4>饼图</h4>
            <el-button @click="copyCode('pie')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "pie",
  "title": "市场份额",
  "series": [{
    "name": "市场份额",
    "data": [
      {"value": 335, "name": "产品A"},
      {"value": 310, "name": "产品B"},
      {"value": 234, "name": "产品C"}
    ],
    "type": "pie"
  }]
}</code></pre>
        </div>
        
        <div class="format-example">
          <div class="example-header">
            <h4>面积图</h4>
            <el-button @click="copyCode('area')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "area",
  "title": "收入趋势",
  "xAxis": {
    "name": "季度",
    "data": ["Q1", "Q2", "Q3", "Q4"]
  },
  "yAxis": {
    "name": "收入(万元)"
  },
  "series": [{
    "name": "收入",
    "data": [150, 230, 224, 218],
    "type": "line"
  }]
}</code></pre>
        </div>
        
        <div class="format-example">
          <div class="example-header">
            <h4>雷达图</h4>
            <el-button @click="copyCode('radar')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "radar",
  "title": "能力评估",
  "radar": {
    "indicator": [
      {"name": "技术能力", "max": 100},
      {"name": "沟通能力", "max": 100},
      {"name": "学习能力", "max": 100},
      {"name": "团队协作", "max": 100},
      {"name": "创新能力", "max": 100}
    ]
  },
  "series": [{
    "name": "张三",
    "data": [85, 90, 88, 92, 87],
    "type": "radar"
  }]
}</code></pre>
        </div>
        
        <div class="format-example">
          <div class="example-header">
            <h4>漏斗图</h4>
            <el-button @click="copyCode('funnel')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "funnel",
  "title": "销售漏斗",
  "series": [{
    "name": "销售漏斗",
    "data": [
      {"value": 100, "name": "访问"},
      {"value": 80, "name": "咨询"},
      {"value": 60, "name": "报价"},
      {"value": 40, "name": "成交"}
    ],
    "type": "funnel"
  }]
}</code></pre>
        </div>
        
        <div class="format-example">
          <div class="example-header">
            <h4>仪表盘</h4>
            <el-button @click="copyCode('gauge')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "gauge",
  "title": "完成率",
  "series": [{
    "name": "完成率",
    "data": [75],
    "type": "gauge"
  }]
}</code></pre>
        </div>
        
        <div class="format-example">
          <div class="example-header">
            <h4>树图</h4>
            <el-button @click="copyCode('tree')" size="small" type="primary" class="copy-btn">
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
          <pre><code>{
  "chartType": "tree",
  "title": "组织架构",
  "series": [{
    "name": "组织架构",
    "data": [{
      "name": "CEO",
      "children": [
        {"name": "技术部", "children": [{"name": "前端组"}, {"name": "后端组"}]},
        {"name": "市场部", "children": [{"name": "销售组"}, {"name": "推广组"}]}
      ]
    }],
    "type": "tree"
  }]
}</code></pre>
        </div>
      </div>
    </div>
    
    <!-- 图表类型选择器对话框 -->
    <el-dialog
      v-model="showSelector"
      title="选择图表类型"
      width="80%"
      :close-on-click-modal="false"
      class="chart-type-dialog"
    >
      <ChartTypeSelector
        @select="onChartTypeSelect"
        @cancel="showSelector = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { TrendCharts, Document, Delete, CircleCheck, CircleClose, MagicStick, Download, FullScreen, CopyDocument, ArrowDown } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import ChartTypeSelector from './ChartTypeSelector.vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  ScatterChart,
  RadarChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  GraphChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  CalendarComponent
} from 'echarts/components'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  GraphChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  CalendarComponent
])

// 响应式数据
const chartDataInput = ref('')
const chartData = ref(null)
const isValid = ref(false)
const chartContainer = ref(null)
const showSelector = ref(false)

  // 计算图表配置
  const chartOption = computed(() => {
    if (!chartData.value) return {}
    
    const data = chartData.value
    const baseOption = {
      title: {
        text: data.title,
        subtext: data.subtitle,
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        },
        subtextStyle: {
          fontSize: 14,
          color: '#666',
          marginTop: 8
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: data.legend || [],
        top: 80,
        bottom: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '25%',
        bottom: '15%',
        containLabel: true
      }
    }

  // 根据图表类型生成配置
  switch (data.chartType) {
    case 'line':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          name: data.xAxis?.name,
          data: data.xAxis?.data || []
        },
        yAxis: {
          type: 'value',
          name: data.yAxis?.name
        },
        series: data.series?.map(series => ({
          ...series,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6
        })) || []
      }
    
    case 'bar':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          name: data.xAxis?.name,
          data: data.xAxis?.data || []
        },
        yAxis: {
          type: 'value',
          name: data.yAxis?.name
        },
        series: data.series?.map(series => ({
          ...series,
          barWidth: '60%'
        })) || []
      }
    
    case 'pie':
      return {
        ...baseOption,
        series: data.series?.map(series => ({
          ...series,
          radius: '50%',
          center: ['50%', '60%']
        })) || []
      }
    
    case 'scatter':
      return {
        ...baseOption,
        xAxis: {
          type: 'value',
          name: data.xAxis?.name
        },
        yAxis: {
          type: 'value',
          name: data.yAxis?.name
        },
        series: data.series || []
      }
    
    case 'area':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          name: data.xAxis?.name,
          data: data.xAxis?.data || []
        },
        yAxis: {
          type: 'value',
          name: data.yAxis?.name
        },
        series: data.series?.map(series => ({
          ...series,
          type: 'line',
          areaStyle: {
            opacity: 0.6
          },
          smooth: true
        })) || []
      }
    
    case 'radar':
      return {
        ...baseOption,
        radar: {
          indicator: data.radar?.indicator || [],
          radius: '65%'
        },
        series: data.series?.map(series => ({
          ...series,
          type: 'radar',
          areaStyle: {
            opacity: 0.3
          }
        })) || []
      }
    
    case 'funnel':
      return {
        ...baseOption,
        series: data.series?.map(series => ({
          ...series,
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          height: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside'
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          }
        })) || []
      }
    
    case 'gauge':
      return {
        ...baseOption,
        series: data.series?.map(series => ({
          ...series,
          type: 'gauge',
          progress: {
            show: true,
            width: 18
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62582,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81567,732.63461 2083.81567,729.018082 C2083.81567,728.932421 2083.81732,728.846935 2083.82061,728.761651 L2088.279,617.318674 C2088.32376,616.199746 2089.24387,615.30999 2090.36389,615.30999 Z',
            length: '75%',
            width: 16,
            offsetCenter: [0, '5%']
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            splitNumber: 2,
            length: 8,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            length: 30,
            lineStyle: {
              width: 4,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 20
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
              borderWidth: 10
            }
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 80,
            offsetCenter: [0, '70%']
          }
        })) || []
      }
    
    case 'heatmap':
      return {
        ...baseOption,
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%'
        },
        calendar: {
          top: 40,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: '2024',
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: { show: false }
        },
        series: data.series || []
      }
    
    case 'tree':
      return {
        ...baseOption,
        series: data.series?.map(series => ({
          ...series,
          type: 'tree',
          data: series.data || [],
          top: '5%',
          left: '7%',
          bottom: '2%',
          right: '20%',
          symbolSize: 7,
          orient: 'vertical',
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 9
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        })) || []
      }
    
    case 'treemap':
      return {
        ...baseOption,
        series: data.series?.map(series => ({
          ...series,
          type: 'treemap',
          data: series.data || [],
          breadcrumb: { show: false }
        })) || []
      }
    
    case 'sunburst':
      return {
        ...baseOption,
        series: data.series?.map(series => ({
          ...series,
          type: 'sunburst',
          data: series.data || [],
          radius: [0, '90%'],
          label: {
            rotate: 'radial'
          }
        })) || []
      }
    
    default:
      return baseOption
  }
})

// 验证输入数据
function validateInput() {
  if (!chartDataInput.value.trim()) {
    isValid.value = false
    return
  }
  
  try {
    const parsed = JSON.parse(chartDataInput.value)
    
    // 检查必要的字段
    if (!parsed.chartType || !parsed.series) {
      isValid.value = false
      return
    }
    
    // 检查特定图表类型的必要字段
    const chartType = parsed.chartType
    let isValidType = true
    
    switch (chartType) {
      case 'radar':
        isValidType = !!(parsed.radar && parsed.radar.indicator && parsed.radar.indicator.length > 0)
        break
      case 'tree':
      case 'treemap':
      case 'sunburst':
        isValidType = !!(parsed.series && parsed.series.length > 0 && parsed.series[0].data)
        break
      case 'gauge':
        isValidType = !!(parsed.series && parsed.series.length > 0 && parsed.series[0].data && parsed.series[0].data.length > 0)
        break
      case 'funnel':
        isValidType = !!(parsed.series && parsed.series.length > 0 && parsed.series[0].data && parsed.series[0].data.length > 0)
        break
      case 'heatmap':
        isValidType = !!(parsed.series && parsed.series.length > 0)
        break
      default:
        // 对于 line, bar, pie, scatter, area 等图表
        if (['line', 'bar', 'area'].includes(chartType)) {
          isValidType = !!(parsed.xAxis && parsed.xAxis.data && parsed.xAxis.data.length > 0)
        }
        break
    }
    
    isValid.value = isValidType
  } catch (e) {
    isValid.value = false
  }
}

// 生成图表
function generateChart() {
  try {
    const parsed = JSON.parse(chartDataInput.value)
    chartData.value = parsed
    ElMessage.success('图表生成成功！')
  } catch (e) {
    ElMessage.error('数据解析失败，请检查格式')
  }
}

// 加载示例数据
function loadExample() {
  chartDataInput.value = `{
  "chartType": "radar",
  "title": "团队能力评估",
  "subtitle": "2024年Q4季度评估结果",
  "radar": {
    "indicator": [
      {"name": "技术能力", "max": 100},
      {"name": "沟通能力", "max": 100},
      {"name": "学习能力", "max": 100},
      {"name": "团队协作", "max": 100},
      {"name": "创新能力", "max": 100},
      {"name": "执行力", "max": 100}
    ]
  },
  "series": [
    {
      "name": "张三",
      "data": [85, 90, 88, 92, 87, 89],
      "type": "radar"
    },
    {
      "name": "李四",
      "data": [78, 85, 92, 88, 90, 86],
      "type": "radar"
    }
  ],
  "legend": ["张三", "李四"],
  "description": "团队整体能力表现优秀，张三在沟通和团队协作方面表现突出，李四在学习能力和创新能力方面表现优异。"
}`
  validateInput()
}

// 清空输入
function clearInput() {
  chartDataInput.value = ''
  chartData.value = null
  isValid.value = false
}

// 下载图表
function downloadChart(command) {
  if (!chartData.value) return
  
  switch (command) {
    case 'png':
      downloadChartAsPNG()
      break
    case 'svg':
      downloadChartAsSVG()
      break
    case 'json':
      downloadChartAsJSON()
      break
    case 'csv':
      downloadChartAsCSV()
      break
  }
}

// 下载PNG图片
function downloadChartAsPNG() {
  const canvas = chartContainer.value?.querySelector('canvas')
  if (canvas) {
    const link = document.createElement('a')
    link.download = `${chartData.value.title || 'chart'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }
}

// 下载SVG图片
function downloadChartAsSVG() {
  const svgElement = chartContainer.value?.querySelector('svg')
  if (svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${chartData.value.title || 'chart'}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }
}

// 下载JSON数据
function downloadChartAsJSON() {
  const dataStr = JSON.stringify(chartData.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${chartData.value.title || 'chart'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// 下载CSV数据
function downloadChartAsCSV() {
  if (!chartData.value.series || !chartData.value.xAxis) return
  
  let csvContent = '时间'
  
  // 添加系列名称作为列标题
  chartData.value.series.forEach(series => {
    csvContent += `,${series.name}`
  })
  csvContent += '\n'
  
  // 添加数据行
  const xData = chartData.value.xAxis.data
  xData.forEach((xValue, index) => {
    csvContent += `${xValue}`
    chartData.value.series.forEach(series => {
      const value = series.data[index] || ''
      csvContent += `,${value}`
    })
    csvContent += '\n'
  })
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${chartData.value.title || 'chart'}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// 全屏查看
function fullscreenChart() {
  if (!chartData.value) return
  
  const chartElement = chartContainer.value?.querySelector('.chart')
  if (chartElement) {
    if (chartElement.requestFullscreen) {
      chartElement.requestFullscreen()
    }
  }
}

// 复制代码
function copyCode(chartType) {
  const codeMap = {
    line: `{
  "chartType": "line",
  "title": "销售趋势",
  "xAxis": {
    "name": "月份",
    "data": ["1月", "2月", "3月", "4月"]
  },
  "yAxis": {
    "name": "销售额"
  },
  "series": [{
    "name": "销售额",
    "data": [120, 132, 101, 134],
    "type": "line"
  }]
}`,
    bar: `{
  "chartType": "bar",
  "title": "产品销量",
  "xAxis": {
    "name": "产品",
    "data": ["A", "B", "C", "D"]
  },
  "yAxis": {
    "name": "销量"
  },
  "series": [{
    "name": "销量",
    "data": [320, 332, 301, 334],
    "type": "bar"
  }]
}`,
    pie: `{
  "chartType": "pie",
  "title": "市场份额",
  "series": [{
    "name": "市场份额",
    "data": [
      {"value": 335, "name": "产品A"},
      {"value": 310, "name": "产品B"},
      {"value": 234, "name": "产品C"}
    ],
    "type": "pie"
  }]
}`,
    area: `{
  "chartType": "area",
  "title": "收入趋势",
  "xAxis": {
    "name": "季度",
    "data": ["Q1", "Q2", "Q3", "Q4"]
  },
  "yAxis": {
    "name": "收入(万元)"
  },
  "series": [{
    "name": "收入",
    "data": [150, 230, 224, 218],
    "type": "line"
  }]
}`,
    radar: `{
  "chartType": "radar",
  "title": "能力评估",
  "radar": {
    "indicator": [
      {"name": "技术能力", "max": 100},
      {"name": "沟通能力", "max": 100},
      {"name": "学习能力", "max": 100},
      {"name": "团队协作", "max": 100},
      {"name": "创新能力", "max": 100}
    ]
  },
  "series": [{
    "name": "张三",
    "data": [85, 90, 88, 92, 87],
    "type": "radar"
  }]
}`,
    funnel: `{
  "chartType": "funnel",
  "title": "销售漏斗",
  "series": [{
    "name": "销售漏斗",
    "data": [
      {"value": 100, "name": "访问"},
      {"value": 80, "name": "咨询"},
      {"value": 60, "name": "报价"},
      {"value": 40, "name": "成交"}
    ],
    "type": "funnel"
  }]
}`,
    gauge: `{
  "chartType": "gauge",
  "title": "完成率",
  "series": [{
    "name": "完成率",
    "data": [75],
    "type": "gauge"
  }]
}`,
    tree: `{
  "chartType": "tree",
  "title": "组织架构",
  "series": [{
    "name": "组织架构",
    "data": [{
      "name": "CEO",
      "children": [
        {"name": "技术部", "children": [{"name": "前端组"}, {"name": "后端组"}]},
        {"name": "市场部", "children": [{"name": "销售组"}, {"name": "推广组"}]}
      ]
    }],
    "type": "tree"
  }]
}`
  }
  
  const code = codeMap[chartType]
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      ElMessage.success('代码已复制到剪贴板！')
    }).catch(() => {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      ElMessage.success('代码已复制到剪贴板！')
    })
  }
}

// 显示图表类型选择器
function showChartTypeSelector() {
  showSelector.value = true
}

// 处理图表类型选择
function onChartTypeSelect(chartType) {
  showSelector.value = false
  
  // 根据选择的图表类型生成示例数据
  const exampleData = generateExampleData(chartType)
  chartDataInput.value = JSON.stringify(exampleData, null, 2)
  validateInput()
  
  ElMessage.success(`已选择${getChartTypeName(chartType)}，并加载了示例数据`)
}

// 生成示例数据
function generateExampleData(chartType) {
  const examples = {
    line: {
      chartType: 'line',
      title: '月度销售趋势',
      subtitle: '2024年销售数据分析',
      xAxis: {
        name: '月份',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        name: '销售额 (万元)'
      },
      series: [
        {
          name: '销售额',
          data: [120, 132, 101, 134, 90, 230],
          type: 'line'
        }
      ],
      legend: ['销售额'],
      description: '销售额呈现波动上升趋势，6月份达到峰值。'
    },
    bar: {
      chartType: 'bar',
      title: '产品销量对比',
      subtitle: '各产品线销量统计',
      xAxis: {
        name: '产品',
        data: ['产品A', '产品B', '产品C', '产品D', '产品E']
      },
      yAxis: {
        name: '销量 (件)'
      },
      series: [
        {
          name: '销量',
          data: [320, 332, 301, 334, 390],
          type: 'bar'
        }
      ],
      legend: ['销量'],
      description: '产品E销量最高，产品C销量最低。'
    },
    pie: {
      chartType: 'pie',
      title: '市场份额分布',
      subtitle: '各品牌市场占有率',
      series: [
        {
          name: '市场份额',
          data: [
            { value: 335, name: '品牌A' },
            { value: 310, name: '品牌B' },
            { value: 234, name: '品牌C' },
            { value: 135, name: '品牌D' },
            { value: 148, name: '其他' }
          ],
          type: 'pie'
        }
      ],
      description: '品牌A占据最大市场份额，达到33.5%。'
    },
    radar: {
      chartType: 'radar',
      title: '员工能力评估',
      subtitle: '多维度能力分析',
      radar: {
        indicator: [
          { name: '技术能力', max: 100 },
          { name: '沟通能力', max: 100 },
          { name: '学习能力', max: 100 },
          { name: '团队协作', max: 100 },
          { name: '创新能力', max: 100 }
        ]
      },
      series: [
        {
          name: '张三',
          data: [85, 90, 88, 92, 87],
          type: 'radar'
        }
      ],
      description: '张三在团队协作方面表现最突出。'
    },
    funnel: {
      chartType: 'funnel',
      title: '销售转化漏斗',
      subtitle: '客户转化流程分析',
      series: [
        {
          name: '转化漏斗',
          data: [
            { value: 100, name: '访问' },
            { value: 80, name: '咨询' },
            { value: 60, name: '报价' },
            { value: 40, name: '成交' }
          ],
          type: 'funnel'
        }
      ],
      description: '从访问到成交的转化率为40%。'
    },
    gauge: {
      chartType: 'gauge',
      title: '项目完成率',
      subtitle: '当前项目进度',
      series: [
        {
          name: '完成率',
          data: [75],
          type: 'gauge'
        }
      ],
      description: '项目已完成75%，进度良好。'
    }
  }
  
  return examples[chartType] || examples.line
}

// 获取图表类型名称
function getChartTypeName(type) {
  const names = {
    'line': '折线图',
    'bar': '柱状图',
    'pie': '饼图',
    'scatter': '散点图',
    'area': '面积图',
    'radar': '雷达图',
    'funnel': '漏斗图',
    'gauge': '仪表盘',
    'tree': '树图',
    'treemap': '矩形树图',
    'sunburst': '旭日图',
    'heatmap': '热力图'
  }
  return names[type] || type
}

// 页面加载时加载示例
onMounted(() => {
  loadExample()
})
</script>

<style scoped>
.chart-visualizer {
  max-width: 1400px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
  transition: color 0.3s ease;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0;
  transition: color 0.3s ease;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.input-section, .chart-section {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px var(--shadow-color);
  transition: all 0.3s ease;
}

.input-header, .chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.input-header h3, .chart-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
}

.input-actions, .chart-actions {
  display: flex;
  gap: 10px;
}

.data-input {
  margin-bottom: 20px;
}

.data-input :deep(.el-textarea__inner) {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.data-input :deep(.el-textarea__inner):focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-hover);
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.validation-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.valid-icon {
  color: #67c23a;
  font-size: 18px;
}

.invalid-icon {
  color: #f56c6c;
  font-size: 18px;
}

.valid-text {
  color: #67c23a;
  font-weight: 500;
}

.invalid-text {
  color: #f56c6c;
  font-weight: 500;
}

.generate-btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
}

.chart-container {
  min-height: 500px;
  border-radius: 15px;
  overflow: hidden;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  border: 2px dashed var(--border-color);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.chart-placeholder p {
  margin-top: 15px;
  font-size: 16px;
}

.chart-wrapper {
  background: var(--bg-secondary);
  border-radius: 15px;
  overflow: hidden;
  transition: background 0.3s ease;
}

.chart {
  width: 100%;
}

.chart-info {
  padding: 20px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.chart-info h4 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.chart-info p {
  margin: 5px 0;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.description {
  font-style: italic;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.format-guide {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px var(--shadow-color);
  transition: all 0.3s ease;
}

.format-guide h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 25px;
  text-align: center;
  transition: color 0.3s ease;
}

.format-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.format-example {
  background: var(--bg-tertiary);
  border-radius: 15px;
  padding: 20px;
  border-left: 4px solid var(--accent-color);
  transition: all 0.3s ease;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.example-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.copy-btn {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.format-example pre {
  margin: 0;
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
}

.format-example code {
  font-family: 'Courier New', monospace;
}

/* 图表类型选择器对话框样式 */
.chart-type-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

.chart-type-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
}

.chart-type-dialog :deep(.el-dialog__title) {
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.chart-type-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

.chart-type-dialog :deep(.el-dialog__body) {
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .input-section, .chart-section, .format-guide {
    padding: 20px;
  }
  
  .format-examples {
    grid-template-columns: 1fr;
  }
  
  .input-footer {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .generate-btn {
    width: 100%;
  }
}
</style>
