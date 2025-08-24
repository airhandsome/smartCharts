<template>
  <div id="app" :class="{ 'dark-theme': isDarkMode }">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <span class="logo-icon">📊</span>
          <span class="logo-text">AI图表生成器</span>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">
            <el-icon><House /></el-icon>
            首页
          </router-link>
          <router-link to="/chart" class="nav-link">
            <el-icon><TrendCharts /></el-icon>
            图表可视化
          </router-link>
          <router-link to="/ai" class="nav-link">
            <el-icon><MagicStick /></el-icon>
            AI预测
          </router-link>
          <router-link to="/analysis" class="nav-link">
            <el-icon><DataAnalysis /></el-icon>
            智能分析
          </router-link>
        </div>
        
        <!-- 主题切换按钮 -->
        <div class="theme-toggle">
          <el-button 
            @click="toggleTheme" 
            :icon="isDarkMode ? Sunny : Moon" 
            circle
            size="small"
            class="theme-btn"
          />
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 可爱的装饰元素 -->
    <div class="decorations">
      <div class="floating-emoji">✨</div>
      <div class="floating-emoji">🌟</div>
      <div class="floating-emoji">💫</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { House, TrendCharts, MagicStick, DataAnalysis, Moon, Sunny } from '@element-plus/icons-vue'

// 主题状态管理
const isDarkMode = ref(false)

// 切换主题
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  applyTheme()
}

// 应用主题
function applyTheme() {
  const html = document.documentElement
  if (isDarkMode.value) {
    html.classList.add('dark-theme')
  } else {
    html.classList.remove('dark-theme')
  }
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = prefersDark
  }
  
  applyTheme()
}

// 监听系统主题变化
function watchSystemTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches
      applyTheme()
    }
  })
}

// 页面加载时初始化
onMounted(() => {
  initTheme()
  watchSystemTheme()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

/* 深色主题样式 */
#app.dark-theme {
  background: #0f172a;
  color: #e2e8f0;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

#app.dark-theme .navbar {
  background: #1e293b;
  border-bottom: 1px solid #334155;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  transition: color 0.3s ease;
}

#app.dark-theme .nav-logo {
  color: #f1f5f9;
}

.logo-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
}

#app.dark-theme .nav-link {
  color: #94a3b8;
}

.nav-link:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

#app.dark-theme .nav-link:hover {
  background: rgba(59, 130, 246, 0.2);
}

.nav-link.router-link-active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  border-bottom: 2px solid #3b82f6;
}

#app.dark-theme .nav-link.router-link-active {
  background: rgba(59, 130, 246, 0.2);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 70px);
}

.decorations {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-emoji {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.floating-emoji:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-emoji:nth-child(2) {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.floating-emoji:nth-child(3) {
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
  }
  
  .nav-links {
    gap: 15px;
  }
  
  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .logo-text {
    font-size: 20px;
  }
}

/* 主题切换按钮样式 */
.theme-toggle {
  margin-left: 20px;
}

.theme-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: scale(1.1);
}

#app.dark-theme .theme-btn {
  background: #334155;
  border: 1px solid #475569;
  color: #94a3b8;
}

#app.dark-theme .theme-btn:hover {
  background: #475569;
  color: #cbd5e1;
}
</style>
