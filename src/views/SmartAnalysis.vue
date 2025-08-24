<template>
  <div class="smart-analysis">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><DataAnalysis /></el-icon>
        智能分析
      </h1>
      <p class="page-subtitle">AI智能识别图表类型，深度解读数据洞察</p>
    </div>

    <div class="main-content">
      <!-- 图表类型识别 -->
      <div class="analysis-section">
        <div class="section-header">
          <h3>图表类型识别</h3>
          <p>上传数据，AI自动识别最适合的图表类型</p>
        </div>
        
        <div class="upload-area">
          <el-upload
            class="data-upload"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="false"
            accept=".json,.csv,.xlsx,.txt,.png,.jpg,.jpeg"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
                         <template #tip>
               <div class="el-upload__tip">
                 支持 JSON、CSV、Excel 等格式，以及 PNG、JPG 图片格式，文件大小不超过 10MB。<br>
                 <strong>图片文件将自动分析，数据文件将自动读取并分析</strong>
               </div>
             </template>
          </el-upload>
        </div>

        <div class="data-input-section" v-if="!uploadedFile">
          <h4>或直接输入数据</h4>
          <el-input
            v-model="dataInput"
            type="textarea"
            :rows="8"
            placeholder="请输入或粘贴你的数据..."
            class="data-textarea"
          />
          <div class="analysis-actions">
            <el-tag 
              :type="apiStatus.type" 
              size="large"
              class="status-tag"
            >
              <el-icon><Connection /></el-icon>
              {{ apiStatus.text }}
            </el-tag>
            <el-button 
              type="primary" 
              @click="analyzeData"
              :disabled="!dataInput.trim()"
              class="analyze-btn"
            >
              <el-icon><Search /></el-icon>
              开始分析
            </el-button>
          </div>
        </div>

        <div class="analysis-result" v-if="analysisResult">
          <div class="result-card">
            <div class="result-header">
              <h4>分析结果</h4>
              <el-tag :type="getTagType(analysisResult.confidence)" size="large">
                置信度: {{ analysisResult.confidence }}%
              </el-tag>
            </div>
            
            <div class="result-content">
              <!-- 图片分析额外信息 -->
              <div v-if="analysisResult.imageDescription" class="image-analysis-info">
                <h5>🖼️ 图片分析</h5>
                <p class="image-description">{{ analysisResult.imageDescription }}</p>
                
                <div v-if="analysisResult.dataFeatures" class="data-features">
                  <h6>数据特征：</h6>
                  <div class="feature-tags">
                    <el-tag 
                      v-for="feature in analysisResult.dataFeatures" 
                      :key="feature"
                      size="small"
                      type="info"
                      class="feature-tag"
                    >
                      {{ feature }}
                    </el-tag>
                  </div>
                </div>
              </div>
              
              <div class="chart-recommendation">
                <h5>推荐图表类型</h5>
                <div class="chart-options">
                  <div 
                    v-for="chart in analysisResult.recommendedCharts" 
                    :key="chart.type"
                    class="chart-option"
                    :class="{ 'recommended': chart.isPrimary }"
                  >
                    <div class="chart-icon">{{ getChartIcon(chart.type) }}</div>
                    <div class="chart-info">
                      <span class="chart-name">{{ getChartTypeName(chart.type) }}</span>
                      <span class="chart-reason">{{ chart.reason }}</span>
                    </div>
                    <el-button 
                      size="small" 
                      type="primary" 
                      @click="generateChart(chart.type)"
                    >
                      生成图表
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表解读 -->
      <div class="analysis-section">
        <div class="section-header">
          <h3>图表解读</h3>
          <p>AI深度分析图表数据，提供专业洞察</p>
        </div>
        
                 <div class="chart-input-section">
           <!-- 文件上传区域 -->
           <div class="upload-area">
             <h4>上传图表文件</h4>
             <el-upload
               class="chart-upload"
               drag
               :auto-upload="false"
               :on-change="handleChartFileChange"
               :show-file-list="false"
               accept=".png,.jpg,.jpeg,.json,.csv,.xlsx,.txt"
             >
               <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
               <div class="el-upload__text">
                 将图表文件拖到此处，或<em>点击上传</em>
               </div>
                            <template #tip>
               <div class="el-upload__tip">
                 支持 PNG、JPG 图片格式，以及 JSON、CSV、Excel 等数据格式，文件大小不超过 10MB。<br>
                 <strong>图片文件将自动分析，数据文件将自动读取并分析</strong>
               </div>
             </template>
             </el-upload>
           </div>
           
           <!-- 分隔线 -->
           <div class="divider">
             <span>或</span>
           </div>
           
           <!-- 文本输入区域 -->
           <div class="text-input-area">
             <h4>直接输入图表数据</h4>
             <el-input
               v-model="chartDataForAnalysis"
               type="textarea"
               :rows="10"
               placeholder="请输入图表数据（JSON格式）..."
               class="chart-textarea"
             />
           </div>
           
           <div class="analysis-actions">
             <el-button @click="loadSampleChart" size="small" type="info">
               <el-icon><Document /></el-icon>
               加载示例
             </el-button>
             <el-button 
               type="primary" 
               @click="analyzeChart"
               :disabled="(!chartDataForAnalysis.trim() && !uploadedChartFile) || isAnalyzingChart"
               :loading="isAnalyzingChart"
             >
               <el-icon><MagicStick /></el-icon>
               {{ isAnalyzingChart ? 'AI解读中...' : 'AI解读图表' }}
             </el-button>
           </div>
         </div>

                 <!-- 解读中状态显示 -->
         <div class="analyzing-status" v-if="isAnalyzingChart">
           <div class="status-card">
             <div class="status-content">
               <div class="loading-animation">
                 <div class="loading-dots">
                   <span></span>
                   <span></span>
                   <span></span>
                 </div>
               </div>
               <h4>AI正在解读图表</h4>
               <p>正在接入DeepSeek AI，请稍候...</p>
               <div class="status-info">
                 <el-tag type="info" size="large">
                   <el-icon><Connection /></el-icon>
                   {{ apiStatus.text }}
                 </el-tag>
               </div>
             </div>
           </div>
         </div>

         <div class="chart-analysis-result" v-if="chartAnalysis">
           <div class="result-card">
             <div class="result-header">
               <h4>图表解读结果</h4>
               <el-button @click="exportAnalysis" size="small" type="success">
                 <el-icon><Download /></el-icon>
                 导出分析
               </el-button>
             </div>
            
            <div class="analysis-content">
              <div class="insight-section">
                <h5>🔍 数据概览</h5>
                <p>{{ chartAnalysis.overview }}</p>
              </div>
              
              <div class="insight-section">
                <h5>📊 关键发现</h5>
                <ul class="insights-list">
                  <li v-for="insight in chartAnalysis.keyInsights" :key="insight">
                    {{ insight }}
                  </li>
                </ul>
              </div>
              
              <div class="insight-section">
                <h5>💡 趋势分析</h5>
                <p>{{ chartAnalysis.trendAnalysis }}</p>
              </div>
              
              <div class="insight-section">
                <h5>⚠️ 注意事项</h5>
                <ul class="insights-list">
                  <li v-for="note in chartAnalysis.considerations" :key="note">
                    {{ note }}
                  </li>
                </ul>
              </div>
              
              <div class="insight-section">
                <h5>🎯 建议行动</h5>
                <p>{{ chartAnalysis.recommendations }}</p>
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
import { ElMessage } from 'element-plus'
import { DataAnalysis, UploadFilled, Search, MagicStick, Document, Download, Connection } from '@element-plus/icons-vue'
import { analyzeData as analyzeDataAPI, analyzeImageAPI, analyzeChartImageAPI } from '../api'

// 响应式数据
const dataInput = ref('')
const uploadedFile = ref(null)
const analysisResult = ref(null)
const chartDataForAnalysis = ref('')
const chartAnalysis = ref(null)
const uploadedChartFile = ref(null)
const isAnalyzingChart = ref(false)

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

// 处理文件上传
function handleFileChange(file) {
  uploadedFile.value = file
  
  // 检查文件类型
  const fileType = file.raw.type
  const fileName = file.raw.name.toLowerCase()
  
  if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileType.startsWith('image/')) {
    // 图片文件，直接分析
    analyzeImageFile(file.raw)
  } else if (fileName.endsWith('.json') || fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    // 数据文件，尝试读取内容并自动分析
    readAndAnalyzeDataFileForChartType(file.raw)
  } else {
    // 其他格式文件，显示成功消息
    ElMessage.success('文件上传成功！请点击"开始分析"按钮进行分析')
  }
}

// 处理图表文件上传
function handleChartFileChange(file) {
  uploadedChartFile.value = file
  
  // 检查文件类型
  const fileType = file.raw.type
  const fileName = file.raw.name.toLowerCase()
  
  if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileType.startsWith('image/')) {
    // 图片文件，直接分析图表
    analyzeChartImageFile(file.raw)
  } else if (fileName.endsWith('.json') || fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    // 数据文件，尝试读取内容并自动分析
    readAndAnalyzeDataFile(file.raw)
  } else {
    // 其他格式文件，显示成功消息
    ElMessage.success('图表文件上传成功！请点击"AI解读图表"按钮进行分析')
  }
}

// 分析图片文件
async function analyzeImageFile(imageFile) {
  try {
    ElMessage.info('正在分析图片...')
    
    // 将图片转换为base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Data = e.target.result
      
      // 调用AI分析图片
      const result = await analyzeImageAPI(base64Data, 'chartType')
      
      if (result.success) {
        analysisResult.value = result.data
        ElMessage.success('图片分析完成！')
      } else {
        throw new Error(result.error || '图片分析失败')
      }
    }
    
    reader.readAsDataURL(imageFile)
    
  } catch (error) {
    console.error('图片分析失败:', error)
    ElMessage.error('图片分析失败，请重试')
  }
}

// 分析图表图片文件
async function analyzeChartImageFile(imageFile) {
  isAnalyzingChart.value = true
  
  try {
    ElMessage.info('正在接入DeepSeek AI分析图表图片...')
    
    // 将图片转换为base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Data = e.target.result
      
      // 调用AI分析图表图片
      const result = await analyzeChartImageAPI(base64Data)
      
      if (result.success) {
        chartAnalysis.value = result.data
        ElMessage.success('图表图片分析完成！')
      } else {
        throw new Error(result.error || '图表图片分析失败')
      }
    }
    
    reader.readAsDataURL(imageFile)
    
  } catch (error) {
    console.error('图表图片分析失败:', error)
    ElMessage.error('图表图片分析失败，请重试')
  } finally {
    isAnalyzingChart.value = false
  }
}

// 读取并分析数据文件
async function readAndAnalyzeDataFile(dataFile) {
  try {
    ElMessage.info('正在读取并分析数据文件...')
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const fileContent = e.target.result
      
      // 将文件内容填入文本输入框
      chartDataForAnalysis.value = fileContent
      
      // 自动开始分析
      await analyzeChart()
    }
    
    reader.readAsText(dataFile)
    
  } catch (error) {
    console.error('数据文件读取失败:', error)
    ElMessage.error('数据文件读取失败，请重试')
  }
}

// 读取并分析数据文件（用于图表类型识别）
async function readAndAnalyzeDataFileForChartType(dataFile) {
  try {
    ElMessage.info('正在读取并分析数据文件...')
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      const fileContent = e.target.result
      
      // 将文件内容填入文本输入框
      dataInput.value = fileContent
      
      // 自动开始分析
      await analyzeData()
    }
    
    reader.readAsText(dataFile)
    
  } catch (error) {
    console.error('数据文件读取失败:', error)
    ElMessage.error('数据文件读取失败，请重试')
  }
}

// 分析数据
async function analyzeData() {
  if (!dataInput.value.trim()) {
    ElMessage.warning('请输入数据')
    return
  }
  
  try {
    const result = await analyzeDataAPI(dataInput.value, 'chartType')
    
    if (result.success) {
      analysisResult.value = result.data
      ElMessage.success('AI数据分析完成！')
    } else {
      throw new Error(result.error || '分析失败')
    }
  } catch (error) {
    console.error('数据分析失败:', error)
    ElMessage.error('数据分析失败，请重试')
  }
}

// 生成图表
function generateChart(chartType) {
  ElMessage.success(`正在生成${getChartTypeName(chartType)}...`)
  // 这里可以跳转到图表生成页面
}

// 加载示例图表
function loadSampleChart() {
  chartDataForAnalysis.value = `{
  "chartType": "line",
  "title": "月度销售趋势分析",
  "xAxis": {
    "name": "月份",
    "data": ["1月", "2月", "3月", "4月", "5月", "6月"]
  },
  "yAxis": {
    "name": "销售额 (万元)"
  },
  "series": [
    {
      "name": "销售额",
      "data": [120, 132, 101, 134, 90, 230],
      "type": "line"
    }
  ]
}`
}

// 分析图表
async function analyzeChart() {
  if (!chartDataForAnalysis.value.trim()) {
    ElMessage.warning('请输入图表数据')
    return
  }
  
  isAnalyzingChart.value = true
  
  try {
    ElMessage.info('正在接入DeepSeek AI，请稍候...')
    const result = await analyzeDataAPI(chartDataForAnalysis.value, 'chartInsight')
    
    if (result.success) {
      chartAnalysis.value = result.data
      ElMessage.success('AI图表解读完成！')
    } else {
      throw new Error(result.error || '解读失败')
    }
  } catch (error) {
    console.error('图表解读失败:', error)
    ElMessage.error('图表解读失败，请重试')
  } finally {
    isAnalyzingChart.value = false
  }
}

// 导出分析结果
function exportAnalysis() {
  const analysisText = `
图表解读报告

数据概览：
${chartAnalysis.value.overview}

关键发现：
${chartAnalysis.value.keyInsights.map(insight => `• ${insight}`).join('\n')}

趋势分析：
${chartAnalysis.value.trendAnalysis}

注意事项：
${chartAnalysis.value.considerations.map(note => `• ${note}`).join('\n')}

建议行动：
${chartAnalysis.value.recommendations}
  `.trim()
  
  const blob = new Blob([analysisText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '图表解读报告.txt'
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('分析报告已导出！')
}

// 获取标签类型
function getTagType(confidence) {
  if (confidence >= 90) return 'success'
  if (confidence >= 70) return 'warning'
  return 'danger'
}

// 获取图表图标
function getChartIcon(type) {
  const icons = {
    'line': '📈',
    'bar': '📊',
    'pie': '🥧',
    'scatter': '🔍',
    'area': '📊',
    'radar': '🎯',
    'funnel': '🫖',
    'gauge': '⏱️',
    'tree': '🌳',
    'treemap': '🗺️',
    'sunburst': '☀️',
    'heatmap': '🔥'
  }
  return icons[type] || '📊'
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
</script>

<style scoped>
.smart-analysis {
  max-width: 1200px;
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
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.analysis-section {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.section-header {
  margin-bottom: 25px;
}

.section-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.section-header p {
  color: var(--text-secondary);
  margin: 0;
  transition: color 0.3s ease;
}

.upload-area {
  margin-bottom: 25px;
}

.data-upload, .chart-upload {
  width: 100%;
}

.divider {
  position: relative;
  text-align: center;
  margin: 30px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  background: var(--bg-secondary);
  padding: 0 20px;
  color: var(--text-secondary);
  font-size: 14px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.text-input-area h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.data-input-section {
  border-top: 1px solid var(--border-color);
  padding-top: 25px;
  transition: border-color 0.3s ease;
}

.data-input-section h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.data-textarea, .chart-textarea {
  margin-bottom: 20px;
}

.analysis-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 5px;
}

.analyze-btn {
  padding: 12px 24px;
  border-radius: 25px;
}

.analysis-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.analysis-result, .chart-analysis-result, .analyzing-status {
  margin-top: 25px;
}

.analyzing-status {
  margin-bottom: 25px;
}

.status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 40px;
  border: 1px solid #e2e8f0;
  color: white;
  text-align: center;
}

.status-content h4 {
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.status-content p {
  margin: 0 0 25px 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.status-info {
  margin-top: 20px;
}

.status-info .el-tag {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.loading-animation {
  margin-bottom: 25px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background: white;
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

.result-card {
  background: #f8fafc;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e2e8f0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.chart-recommendation h5 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
}

.chart-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chart-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.chart-option.recommended {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.chart-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.chart-icon {
  font-size: 2rem;
  width: 50px;
  text-align: center;
}

.chart-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.chart-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.chart-reason {
  color: #666;
  font-size: 0.9rem;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.insight-section h5 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.insight-section p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.insights-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  line-height: 1.6;
}

.insights-list li {
  margin-bottom: 8px;
}

/* 图片分析样式 */
.image-analysis-info {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #17a2b8;
}

.image-analysis-info h5 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.image-description {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.6;
}

.data-features h6 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .analysis-section {
    padding: 20px;
  }
  
  .result-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .chart-option {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .chart-info {
    text-align: center;
  }
}
</style>
