<template>
  <div class="ai-predictor">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><MagicStick /></el-icon>
        AI预测生成
      </h1>
      <p class="page-subtitle">描述你的需求，AI智能生成专业图表</p>
    </div>

    <div class="main-content">
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-header">
          <h3>需求描述</h3>
          <div class="input-actions">
            <el-button @click="loadExamples" size="small" type="info">
              <el-icon><Document /></el-icon>
              查看示例
            </el-button>
            <el-button @click="clearInput" size="small" type="warning">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>
        
        <el-input
          v-model="userQuery"
          type="textarea"
          :rows="6"
          placeholder="请描述你的图表需求，例如：帮我预测2025年北京房价走势、分析2024年中国GDP增长趋势..."
          class="query-input"
        />
        
        <div class="query-examples" v-if="showExamples">
          <h4>示例查询：</h4>
          <div class="example-list">
            <div 
              v-for="example in examples" 
              :key="example.id"
              class="example-item"
              @click="useExample(example.query)"
            >
              <span class="example-icon">💡</span>
              <span class="example-text">{{ example.query }}</span>
            </div>
          </div>
        </div>
        
        <div class="input-footer">
          <div class="api-status">
            <el-tag 
              :type="apiStatus.type" 
              size="large"
              class="status-tag"
            >
              <el-icon><Connection /></el-icon>
              {{ apiStatus.text }}
            </el-tag>
            <div class="api-info" v-if="apiStatus.type === 'warning'">
              <el-button 
                @click="showApiConfig" 
                size="small" 
                type="info" 
                text
              >
                配置API密钥
              </el-button>
            </div>
          </div>
          <el-button 
            type="primary" 
            size="large" 
            @click="generateChart"
            :disabled="!userQuery.trim() || isGenerating"
            :loading="isGenerating"
            class="generate-btn"
          >
            <el-icon><MagicStick /></el-icon>
            {{ isGenerating ? 'AI思考中...' : '生成图表' }}
          </el-button>
        </div>
      </div>

      <!-- 生成结果区域 -->
      <div class="result-section">
        <div class="result-header">
          <h3>AI生成结果</h3>
          <div class="result-actions" v-if="chartData">
            <el-button @click="regenerateChart" size="small" type="warning">
              <el-icon><Refresh /></el-icon>
              重新生成
            </el-button>
                         <el-dropdown @command="downloadChart" size="small" type="success">
               <el-button type="success">
                 <el-icon><Download /></el-icon>
                 下载图表
                 <el-icon class="el-icon--right"><arrow-down /></el-icon>
               </el-button>
               <template #dropdown>
                 <el-dropdown-menu>
                   <el-dropdown-item command="png">下载PNG图片</el-dropdown-item>
                   <el-dropdown-item command="json">下载JSON数据</el-dropdown-item>
                   <el-dropdown-item command="csv">下载CSV数据</el-dropdown-item>
                 </el-dropdown-menu>
               </template>
             </el-dropdown>
          </div>
        </div>
        
        <div class="result-container">
          <div v-if="!chartData && !isGenerating" class="result-placeholder">
            <el-icon size="64"><MagicStick /></el-icon>
            <p>描述你的需求，AI将为你生成专业图表</p>
          </div>
          
          <div v-else-if="isGenerating" class="generating-placeholder">
            <div class="loading-animation">
              <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <p>AI正在分析你的需求，请稍候...</p>
          </div>
          
          <div v-else class="result-content">
            <div class="chart-wrapper">
                           <v-chart 
               :option="chartOption" 
               :style="{ height: '500px' }"
               class="chart"
             />
            </div>
            
                         <div class="result-info">
               <div class="info-header">
                 <h4>{{ chartData.title }}</h4>
                 <p v-if="chartData.subtitle" class="subtitle">{{ chartData.subtitle }}</p>
               </div>
               
               <div class="ai-insights">
                 <h5>AI分析洞察</h5>
                 <p v-if="chartData.description">{{ chartData.description }}</p>
               </div>

                               <!-- 数据分析详情 -->
                <div v-if="chartData.dataAnalysis" class="data-analysis">
                  <div class="analysis-header">
                    <el-dropdown @command="downloadAnalysis" size="small" type="info">
                      <el-button type="info" size="small">
                        <el-icon><Download /></el-icon>
                        下载分析报告
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="json">下载JSON报告</el-dropdown-item>
                          <el-dropdown-item command="txt">下载文本报告</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                  <el-collapse v-model="activeAnalysis" accordion>
                    <el-collapse-item title="📊 数据分析详情" name="analysis">
                      <div class="analysis-content">
                       <!-- 数据来源 -->
                       <div class="analysis-section">
                         <h6>📈 数据来源</h6>
                         <div class="source-list">
                           <el-tag 
                             v-for="source in chartData.dataAnalysis.dataSources" 
                             :key="source"
                             size="small"
                             type="info"
                             class="source-tag"
                           >
                             {{ source }}
                           </el-tag>
                         </div>
                       </div>

                       <!-- 分析方法 -->
                       <div class="analysis-section">
                         <h6>🔬 分析方法</h6>
                         <p>{{ chartData.dataAnalysis.methodology }}</p>
                       </div>

                       <!-- 假设条件 -->
                       <div class="analysis-section">
                         <h6>💭 假设条件</h6>
                         <ul class="assumption-list">
                           <li v-for="assumption in chartData.dataAnalysis.assumptions" :key="assumption">
                             {{ assumption }}
                           </li>
                         </ul>
                       </div>

                       <!-- 置信度 -->
                       <div class="analysis-section">
                         <h6>🎯 置信度评估</h6>
                         <p>{{ chartData.dataAnalysis.confidence }}</p>
                       </div>

                       <!-- 关键因素 -->
                       <div class="analysis-section">
                         <h6>🔑 关键影响因素</h6>
                         <div class="factor-list">
                           <el-tag 
                             v-for="factor in chartData.dataAnalysis.keyFactors" 
                             :key="factor"
                             size="small"
                             type="success"
                             class="factor-tag"
                           >
                             {{ factor }}
                           </el-tag>
                         </div>
                       </div>

                       <!-- 趋势解释 -->
                       <div class="analysis-section">
                         <h6>📈 趋势变化解释</h6>
                         <p>{{ chartData.dataAnalysis.trendExplanation }}</p>
                       </div>

                       <!-- 市场背景 -->
                       <div class="analysis-section">
                         <h6>🌍 市场背景分析</h6>
                         <p>{{ chartData.dataAnalysis.marketContext }}</p>
                       </div>

                       <!-- 局限性 -->
                       <div class="analysis-section">
                         <h6>⚠️ 局限性说明</h6>
                         <ul class="limitation-list">
                           <li v-for="limitation in chartData.dataAnalysis.limitations" :key="limitation">
                             {{ limitation }}
                           </li>
                         </ul>
                       </div>
                     </div>
                   </el-collapse-item>
                 </el-collapse>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MagicStick, Document, Delete, Connection, Refresh, Download, ArrowDown } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  RadarChart,
  FunnelChart,
  GaugeChart,
  TreeChart,
  TreemapChart,
  SunburstChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
import { generateChartData, generateChartDataMock } from '../api'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  FunnelChart,
  GaugeChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
])

// 响应式数据
const userQuery = ref('')
const chartData = ref(null)
const isGenerating = ref(false)
const showExamples = ref(false)
const activeAnalysis = ref('analysis')

// 示例查询
const examples = [
  { id: 1, query: '帮我预测2025年北京房价走势' },
  { id: 2, query: '分析2024年中国GDP增长趋势' },
  { id: 3, query: '预测未来5年新能源汽车销量' },
  { id: 4, query: '分析上海房价均价与租售比走势' }
]

// API状态
const apiStatus = computed(() => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (apiKey && apiKey !== 'your_deepseek_api_key_here') {
    return {
      type: 'success',
      text: 'DeepSeek API已连接'
    }
  } else {
    return {
      type: 'warning',
      text: '使用模拟数据'
    }
  }
})

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

  switch (data.chartType) {
    case 'line':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: data.xAxis?.data || []
        },
        yAxis: {
          type: 'value'
        },
        series: data.series || []
      }
    
    case 'bar':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: data.xAxis?.data || []
        },
        yAxis: {
          type: 'value'
        },
        series: data.series || []
      }
    
    case 'pie':
      return {
        ...baseOption,
        series: data.series || []
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

// 生成图表
async function generateChart() {
  if (!userQuery.value.trim()) {
    ElMessage.warning('请输入图表需求描述')
    return
  }
  
  isGenerating.value = true
  chartData.value = null
  
  try {
    // 检查是否有真实的API密钥
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    let result
    
    if (apiKey && apiKey !== 'your_deepseek_api_key_here') {
      // 使用真实的DeepSeek API
      result = await generateChartData(userQuery.value)
    } else {
      // 使用模拟数据
      result = await generateChartDataMock(userQuery.value)
    }
    
    if (result.success) {
      chartData.value = result.data
      ElMessage.success('AI图表生成成功！')
    } else {
      throw new Error(result.error || '生成失败')
    }
  } catch (error) {
    console.error('图表生成失败:', error)
    ElMessage.error('图表生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

// 重新生成图表
async function regenerateChart() {
  try {
    await ElMessageBox.confirm('确定要重新生成图表吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await generateChart()
  } catch {
    // 用户取消
  }
}

// 使用示例
function useExample(query) {
  userQuery.value = query
  showExamples.value = false
}

// 加载示例
function loadExamples() {
  showExamples.value = !showExamples.value
}

// 清空输入
function clearInput() {
  userQuery.value = ''
  chartData.value = null
  showExamples.value = false
}

// 下载图表
function downloadChart(command) {
  if (!chartData.value) return
  
  switch (command) {
    case 'png':
      downloadChartAsPNG()
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
  const canvas = document.querySelector('.chart canvas')
  if (canvas) {
    const link = document.createElement('a')
    link.download = `${chartData.value.title || 'ai-chart'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }
}

// 下载JSON数据
function downloadChartAsJSON() {
  const dataStr = JSON.stringify(chartData.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${chartData.value.title || 'ai-chart'}.json`
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
  link.download = `${chartData.value.title || 'ai-chart'}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// 下载分析报告
function downloadAnalysis(command) {
  if (!chartData.value.dataAnalysis) return
  
  switch (command) {
    case 'json':
      downloadAnalysisAsJSON()
      break
    case 'txt':
      downloadAnalysisAsTXT()
      break
  }
}

// 下载JSON格式分析报告
function downloadAnalysisAsJSON() {
  const analysisData = {
    title: chartData.value.title,
    subtitle: chartData.value.subtitle,
    description: chartData.value.description,
    analysis: chartData.value.dataAnalysis
  }
  
  const dataStr = JSON.stringify(analysisData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${chartData.value.title || 'analysis'}-报告.json`
  link.click()
  URL.revokeObjectURL(url)
}

// 下载文本格式分析报告
function downloadAnalysisAsTXT() {
  const analysis = chartData.value.dataAnalysis
  let txtContent = `${chartData.value.title}\n`
  txtContent += `${chartData.value.subtitle}\n`
  txtContent += `\n${chartData.value.description}\n`
  txtContent += '\n=== 数据分析报告 ===\n\n'
  
  txtContent += `数据来源：\n${analysis.dataSources.join('\n')}\n\n`
  txtContent += `分析方法：\n${analysis.methodology}\n\n`
  txtContent += `假设条件：\n${analysis.assumptions.join('\n')}\n\n`
  txtContent += `置信度评估：\n${analysis.confidence}\n\n`
  txtContent += `关键影响因素：\n${analysis.keyFactors.join('\n')}\n\n`
  txtContent += `趋势变化解释：\n${analysis.trendExplanation}\n\n`
  txtContent += `市场背景分析：\n${analysis.marketContext}\n\n`
  txtContent += `局限性说明：\n${analysis.limitations.join('\n')}\n`
  
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${chartData.value.title || 'analysis'}-报告.txt`
  link.click()
  URL.revokeObjectURL(url)
}

// 显示API配置信息
function showApiConfig() {
  ElMessageBox.alert(
    `要使用真实的DeepSeek API，请按以下步骤操作：

1. 复制 env.example 文件为 .env
2. 在 .env 文件中设置你的API密钥：
   VITE_DEEPSEEK_API_KEY=your_actual_api_key_here
3. 重启开发服务器

如果没有配置API密钥，系统将使用模拟数据进行演示。`,
    'API配置说明',
    {
      confirmButtonText: '知道了',
      type: 'info'
    }
  )
}
</script>

<style scoped>
.ai-predictor {
  max-width: 1400px;
  margin: 0 auto;
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

.input-section, .result-section {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px var(--shadow-color);
  transition: all 0.3s ease;
}

.input-header, .result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.input-header h3, .result-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
}

.input-actions, .result-actions {
  display: flex;
  gap: 10px;
}

.query-input {
  margin-bottom: 20px;
}

.query-input :deep(.el-textarea__inner) {
  font-size: 16px;
  line-height: 1.6;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.query-input :deep(.el-textarea__inner):focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-hover);
}

.query-examples {
  margin-bottom: 20px;
  padding: 20px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  border-left: 4px solid var(--accent-color);
  transition: all 0.3s ease;
}

.query-examples h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 1rem;
  transition: color 0.3s ease;
}

.example-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
}

.example-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.example-item:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.example-icon {
  font-size: 1.2rem;
}

.example-text {
  font-size: 14px;
  line-height: 1.4;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 5px;
}

.api-info {
  margin-top: 8px;
  text-align: center;
}

.generate-btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
}

.result-container {
  min-height: 500px;
  border-radius: 15px;
  overflow: hidden;
}

.result-placeholder, .generating-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  color: #999;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  border-radius: 15px;
}

.result-placeholder p, .generating-placeholder p {
  margin-top: 15px;
  font-size: 16px;
}

.loading-animation {
  margin-bottom: 20px;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.result-content {
  background: white;
  border-radius: 15px;
  overflow: hidden;
}

.chart-wrapper {
  padding: 30px 20px 20px 20px;
}

.chart {
  width: 100%;
}

.result-info {
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.info-header h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.3rem;
}

.subtitle {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 1rem;
}

.ai-insights h5 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.ai-insights p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

/* 数据分析样式 */
.data-analysis {
  margin-top: 20px;
}

.analysis-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.analysis-content {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.analysis-section {
  margin-bottom: 20px;
}

.analysis-section:last-child {
  margin-bottom: 0;
}

.analysis-section h6 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-section p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.source-list, .factor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.source-tag, .factor-tag {
  margin: 0;
}

.assumption-list, .limitation-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  line-height: 1.6;
}

.assumption-list li, .limitation-list li {
  margin-bottom: 8px;
}

.assumption-list li:last-child, .limitation-list li:last-child {
  margin-bottom: 0;
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
  
  .input-section, .result-section {
    padding: 20px;
  }
  
  .input-footer {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .generate-btn {
    width: 100%;
  }
  
  .example-list {
    grid-template-columns: 1fr;
  }
}
</style>
