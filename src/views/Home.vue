<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-icon">🎨</span>
            智能图表生成器
          </h1>
          <p class="hero-subtitle">
            让数据可视化变得简单有趣，AI助你轻松创建专业图表
          </p>
          <div class="hero-features">
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span>智能图表生成</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🤖</span>
              <span>AI预测分析</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <span>一键可视化</span>
            </div>
          </div>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="$router.push('/chart')" class="action-btn">
              <el-icon><TrendCharts /></el-icon>
              开始创建图表
            </el-button>
            <el-button size="large" @click="$router.push('/ai')" class="action-btn">
              <el-icon><MagicStick /></el-icon>
              试试AI预测
            </el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-container">
            <div class="chart-cards">
              <div class="chart-card line-card">
                <div class="card-header">
                  <span class="chart-icon">📈</span>
                  <span class="card-title">趋势分析</span>
                </div>
                <div class="mini-chart">
                  <svg viewBox="0 0 100 40" class="trend-line">
                    <polyline points="10,30 25,20 40,25 55,15 70,18 85,10" 
                              fill="none" stroke="#3b82f6" stroke-width="2"/>
                    <circle cx="10" cy="30" r="2" fill="#3b82f6"/>
                    <circle cx="25" cy="20" r="2" fill="#3b82f6"/>
                    <circle cx="40" cy="25" r="2" fill="#3b82f6"/>
                    <circle cx="55" cy="15" r="2" fill="#3b82f6"/>
                    <circle cx="70" cy="18" r="2" fill="#3b82f6"/>
                    <circle cx="85" cy="10" r="2" fill="#3b82f6"/>
                  </svg>
                </div>
              </div>
              
              <div class="chart-card bar-card">
                <div class="card-header">
                  <span class="chart-icon">📊</span>
                  <span class="card-title">数据对比</span>
                </div>
                <div class="mini-chart">
                  <div class="bar-container">
                    <div class="bar" style="height: 60%; background: #06b6d4;"></div>
                    <div class="bar" style="height: 80%; background: #3b82f6;"></div>
                    <div class="bar" style="height: 45%; background: #10b981;"></div>
                    <div class="bar" style="height: 70%; background: #f59e0b;"></div>
                  </div>
                </div>
              </div>
              
              <div class="chart-card pie-card">
                <div class="card-header">
                  <span class="chart-icon">🥧</span>
                  <span class="card-title">占比分析</span>
                </div>
                <div class="mini-chart">
                  <div class="pie-chart">
                    <div class="pie-segment segment-1"></div>
                    <div class="pie-segment segment-2"></div>
                    <div class="pie-segment segment-3"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="floating-elements">
              <div class="float-item item-1">✨</div>
              <div class="float-item item-2">📈</div>
              <div class="float-item item-3">🎯</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能展示区域 -->
    <section class="features">
      <h2 class="section-title">核心功能</h2>
      <div class="features-grid">
        <div class="feature-card" @click="$router.push('/chart')">
          <div class="feature-icon-wrapper">
            <el-icon size="48"><TrendCharts /></el-icon>
          </div>
          <h3>图表可视化</h3>
          <p>通过输入格式化的数据，快速生成各种类型的图表，支持折线图、柱状图、饼图等多种样式</p>
          <div class="feature-example">
            <code>{"type": "line", "data": [1,2,3,4,5]}</code>
          </div>
        </div>

        <div class="feature-card" @click="$router.push('/ai')">
          <div class="feature-icon-wrapper">
            <el-icon size="48"><MagicStick /></el-icon>
          </div>
          <h3>AI预测生成</h3>
          <p>只需描述你的需求，AI就能智能分析并生成相应的图表数据，让预测变得简单</p>
          <div class="feature-example">
            <code>"帮我预测2025年北京房价走势"</code>
          </div>
        </div>

        <div class="feature-card" @click="$router.push('/analysis')">
          <div class="feature-icon-wrapper">
            <el-icon size="48"><DataAnalysis /></el-icon>
          </div>
          <h3>智能分析</h3>
          <p>AI自动识别最佳图表类型，深度解读数据洞察，提供专业分析报告</p>
          <div class="feature-example">
            <code>智能推荐 + 深度解读</code>
          </div>
        </div>
      </div>
    </section>

    <!-- 图表类型展示区域 -->
    <section class="chart-types">
      <h2 class="section-title">支持的图表类型</h2>
      <div class="chart-types-grid">
        <div class="chart-type-item">
          <div class="chart-icon">📈</div>
          <h4>折线图</h4>
          <p>趋势分析、时间序列</p>
        </div>
        <div class="chart-type-item">
          <div class="chart-icon">📊</div>
          <h4>柱状图</h4>
          <p>数据对比、分类统计</p>
        </div>
        <div class="chart-type-item">
          <div class="chart-icon">🥧</div>
          <h4>饼图</h4>
          <p>占比分析、构成分布</p>
        </div>
        <div class="chart-type-item">
          <div class="chart-icon">🎯</div>
          <h4>雷达图</h4>
          <p>多维度对比、能力评估</p>
        </div>
        <div class="chart-type-item">
          <div class="chart-icon">🫖</div>
          <h4>漏斗图</h4>
          <p>转化流程、业务流程</p>
        </div>
        <div class="chart-type-item">
          <div class="chart-icon">⏱️</div>
          <h4>仪表盘</h4>
          <p>进度展示、指标监控</p>
        </div>
        <div class="chart-type-item">
          <div class="chart-icon">🌳</div>
          <h4>树图</h4>
          <p>层级结构、组织架构</p>
        </div>
        <div class="chart-type-item">
          <div class="chart-icon">🔥</div>
          <h4>热力图</h4>
          <p>密度分布、相关性分析</p>
        </div>
      </div>
    </section>

    <!-- 使用说明区域 -->
    <section class="usage">
      <h2 class="section-title">快速开始</h2>
      <div class="usage-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>选择功能</h3>
            <p>选择图表可视化或AI预测生成功能</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>输入需求</h3>
            <p>输入数据格式或描述你的图表需求</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>生成图表</h3>
            <p>AI自动分析并生成专业的图表可视化</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 可爱装饰元素 -->
    <div class="decorative-elements">
      <div class="floating-heart">💖</div>
      <div class="floating-star">⭐</div>
      <div class="floating-sparkle">✨</div>
    </div>
  </div>
</template>

<script setup>
import { TrendCharts, MagicStick, DataAnalysis } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  position: relative;
  overflow-x: hidden;
}

.hero {
  padding: 60px 0;
  margin-bottom: 80px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: var(--text-primary);
  line-height: 1.2;
  transition: color 0.3s ease;
}

.title-icon {
  font-size: 4rem;
  margin-right: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.hero-features {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-secondary);
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 500;
  color: var(--text-secondary);
  box-shadow: 0 2px 10px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 1.2rem;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-container {
  position: relative;
  width: 450px;
  height: 350px;
}

.chart-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
  height: 100%;
}

.chart-card {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 16px 16px 0 0;
}

.bar-card::before {
  background: linear-gradient(90deg, #06b6d4, #10b981);
}

.pie-card::before {
  background: linear-gradient(90deg, #10b981, #f59e0b);
}

.pie-card {
  grid-column: span 2;
  grid-row: 2;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.chart-icon {
  font-size: 1.2rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.mini-chart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-line {
  width: 100%;
  height: 40px;
}

.bar-container {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 50px;
  width: 100%;
  justify-content: center;
}

.bar {
  width: 12px;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
}

.chart-card:hover .bar {
  transform: scaleY(1.1);
}

.pie-chart {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    #3b82f6 0deg 120deg,
    #06b6d4 120deg 200deg,
    #10b981 200deg 280deg,
    #f59e0b 280deg 360deg
  );
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.float-item {
  position: absolute;
  font-size: 1.5rem;
  animation: floatAround 8s ease-in-out infinite;
  opacity: 0.7;
}

.item-1 {
  top: 10%;
  right: -10%;
  animation-delay: 0s;
}

.item-2 {
  bottom: 20%;
  left: -15%;
  animation-delay: 2s;
}

.item-3 {
  top: 60%;
  right: -5%;
  animation-delay: 4s;
}

@keyframes floatAround {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-15px) rotate(90deg);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.6;
  }
  75% {
    transform: translateY(-20px) rotate(270deg);
    opacity: 0.8;
  }
}

.features {
  margin-bottom: 80px;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 50px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: var(--bg-secondary);
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
  transition: color 0.3s ease;
}

.feature-example {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.feature-example code {
  color: #667eea;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

  .chart-types {
    margin-bottom: 80px;
  }

  .chart-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
  }

  .chart-type-item {
    background: var(--bg-secondary);
    padding: 25px 20px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 4px 15px var(--shadow-color);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .chart-type-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  .chart-type-item .chart-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
    display: block;
  }

  .chart-type-item h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .chart-type-item p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
    transition: color 0.3s ease;
  }

  .usage {
    margin-bottom: 80px;
  }

.usage-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.step {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 25px var(--shadow-color);
  transition: all 0.3s ease;
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.step-content p {
  color: var(--text-secondary);
  margin: 0;
  transition: color 0.3s ease;
}

.decorative-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-heart {
  position: absolute;
  top: 15%;
  right: 10%;
  font-size: 2rem;
  animation: float 8s ease-in-out infinite;
  animation-delay: 0s;
}

.floating-star {
  position: absolute;
  top: 45%;
  left: 5%;
  font-size: 1.5rem;
  animation: float 6s ease-in-out infinite;
  animation-delay: 2s;
}

.floating-sparkle {
  position: absolute;
  bottom: 25%;
  right: 15%;
  font-size: 1.8rem;
  animation: float 7s ease-in-out infinite;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .title-icon {
    font-size: 3rem;
  }
  
  .hero-features {
    justify-content: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-types-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .chart-type-item {
    padding: 20px 15px;
  }
  
  .chart-type-item .chart-icon {
    font-size: 2rem;
  }
  
  .usage-steps {
    grid-template-columns: 1fr;
  }
  
  .visual-container {
    width: 320px;
    height: 280px;
  }
  
  .chart-cards {
    gap: 10px;
  }
  
  .chart-card {
    padding: 15px;
  }
  
  .card-title {
    font-size: 0.8rem;
  }
  
  .pie-chart {
    width: 50px;
    height: 50px;
  }
}
</style>
