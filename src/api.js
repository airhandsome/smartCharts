import axios from 'axios'

// DeepSeek API配置
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'your_deepseek_api_key_here'

// 创建axios实例
const api = axios.create({
  baseURL: DEEPSEEK_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
  }
})

// 构建图表预测的提示词
function buildChartPrompt(userQuery) {
  return `你是一个专业的数据分析师和图表专家。请根据用户的需求，生成一个完整的图表数据结构和配置。

请帮我分析这个问题：${userQuery}，这个分析结果需要有理有据，不应该是瞎编的数据。并且根据要求返回数据图表，

请按照以下JSON格式返回结果，确保数据真实可信且符合逻辑：

{
  "chartType": "图表类型（line/bar/pie/scatter等）",
  "title": "图表标题",
  "subtitle": "图表副标题",
  "xAxis": {
    "name": "X轴名称",
    "data": ["X轴数据数组"]
  },
  "yAxis": {
    "name": "Y轴名称"
  },
  "series": [
    {
      "name": "数据系列名称",
      "data": [对应的数值数组],
      "type": "图表类型"
    }
  ],
  "legend": ["图例数组"],
  "tooltip": "提示信息",
  "description": "图表描述和说明",
  "dataAnalysis": {
    "dataSources": ["数据来源1", "数据来源2"],
    "methodology": "分析方法说明",
    "assumptions": ["假设条件1", "假设条件2"],
    "confidence": "置信度说明",
    "limitations": ["局限性1", "局限性2"],
    "keyFactors": ["关键影响因素1", "关键影响因素2"],
    "trendExplanation": "趋势变化解释",
    "marketContext": "市场背景分析"
  }
}

重要要求：
1. 数据必须基于真实的市场情况、经济指标或历史数据
2. 提供具体的数据来源和分析方法
3. 明确说明假设条件和局限性
4. 解释关键影响因素和趋势变化原因
5. 给出合理的置信度评估
6. 所有数据都要有逻辑推理过程，不能凭空捏造

**关键数据特征要求：**
7. 时间序列数据必须体现**曲折波动性**，不能是直线线性变化
8. 每个数据点都应该有合理的**上下波动**，体现市场的不确定性
9. 波动幅度要**真实合理**，既不能过于剧烈，也不能过于平滑
10. 数据变化要体现**市场周期**、**政策影响**、**季节性**等真实因素
11. 相邻数据点之间应该有**自然的起伏**，避免机械的线性增长或下降
12. 对于预测数据，要体现**预测的不确定性**，数据应该呈现波浪式变化
`
}

// 调用DeepSeek API
export async function generateChartData(userQuery) {
  try {
    const prompt = buildChartPrompt(userQuery)
    
    const response = await api.post('', {
      model: 'deepseek-chat',
      messages: [
                 {
           role: 'system',
           content: '你是一个专业的数据分析师，专门负责生成图表数据。请严格按照要求的JSON格式返回结果。特别注意：所有时间序列数据必须体现真实的波动性和曲折性，不能是直线线性变化。数据应该反映市场的自然起伏、政策周期、季节性变化等因素。'
         },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    // 解析返回的内容
    const content = response.data.choices[0].message.content
    
    // 尝试提取JSON数据
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const chartData = JSON.parse(jsonMatch[0])
      return {
        success: true,
        data: chartData
      }
    } else {
      throw new Error('无法解析返回的JSON数据')
    }
    
  } catch (error) {
    console.error('API调用失败:', error)
    return {
      success: false,
      error: error.message || 'API调用失败'
    }
  }
}

// 模拟API调用（用于演示，当没有真实API密钥时）
export async function generateChartDataMock(userQuery) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 根据用户查询生成模拟数据
  if (userQuery.includes('房价') || userQuery.includes('房价走势')) {
    return {
      success: true,
      data: {
        chartType: 'line',
        title: '上海房价走势预测 (2015-2035)',
        subtitle: '基于历史数据和当前市场趋势分析',
        xAxis: {
          name: '年份',
          data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035']
        },
        yAxis: {
          name: '房价 (万元/平方米)'
        },
        series: [
          {
            name: '实际房价',
            data: [3.2, 3.8, 4.5, 5.2, 5.8, 6.1, 6.8, 7.2, 7.5, 7.8, null, null, null, null, null, null, null, null, null, null, null],
            type: 'line'
          },
                     {
             name: '预测房价',
             data: [null, null, null, null, null, null, null, null, null, null, 7.6, 7.1, 7.9, 7.3, 7.2, 7.8, 7.0, 6.9, 7.5, 7.1, 6.7],
             type: 'line'
           }
        ],
        legend: ['实际房价', '预测房价'],
        tooltip: '房价走势预测',
        description: '基于市场波动规律和政策调控周期，预测未来10年上海房价将在合理区间内波动，体现市场调整和反弹的周期性特征，年均波动幅度约2-3%。',
        dataAnalysis: {
          dataSources: [
            "国家统计局房价指数",
            "上海房管局历史交易数据",
            "贝壳研究院市场报告",
            "中指研究院房价监测"
          ],
          methodology: "采用时间序列分析和趋势外推法，结合政策周期和宏观经济指标进行预测",
          assumptions: [
            "政策调控保持连续性",
            "经济基本面相对稳定",
            "人口流动趋势延续",
            "土地供应政策稳定"
          ],
          confidence: "预测置信度为80%，基于历史数据稳定性和政策可预期性",
          limitations: [
            "未考虑重大政策变化",
            "宏观经济波动影响有限",
            "区域发展不平衡未完全纳入"
          ],
          keyFactors: [
            "政策调控周期（3-5年）",
            "经济周期波动",
            "供需关系变化",
            "市场心理预期"
          ],
          trendExplanation: "房价波动主要受政策调控周期影响，体现市场调整和反弹的周期性特征。",
          marketContext: "当前房地产市场处于调整期，政策强调稳定发展，预计未来将更加理性。"
        }
      }
    }
  } else if (userQuery.includes('租售比') || userQuery.includes('房价均价')) {
    return {
      success: true,
      data: {
        chartType: 'line',
        title: '上海2025-2035年房价均价与租售比走势预测',
        subtitle: '基于市场波动特征的理性预测',
        xAxis: {
          name: '年份',
          data: ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035']
        },
        yAxis: [
          {
            name: '房价均价（万元/平方米）',
            position: 'left'
          },
          {
            name: '租售比（%）',
            position: 'right'
          }
        ],
        series: [
                     {
             name: '房价均价（万元/平方米）',
             data: [7.6, 7.1, 7.9, 7.3, 7.2, 7.8, 7.0, 6.9, 7.5, 7.1, 6.7],
             type: 'line',
             yAxisIndex: 0
           },
           {
             name: '租售比（%）',
             data: [2.8, 3.3, 2.7, 3.2, 3.5, 2.9, 3.4, 3.7, 3.1, 3.6, 3.9],
             type: 'line',
             yAxisIndex: 1
           }
        ],
        legend: ['房价均价（万元/平方米）', '租售比（%）'],
        tooltip: '显示年份、房价均价和租售比的具体数值',
        description: '该图表预测了上海2025年至2035年的房价均价和租售比走势。房价均价预计在7.0-7.8万元/平方米区间内波动，体现市场调整和反弹的周期性特征。租售比在2.8%-3.8%之间波动，反映租金和房价的相对变化关系。',
        dataAnalysis: {
          dataSources: [
            "国家统计局房价指数数据",
            "上海房管局交易数据",
            "贝壳研究院市场报告",
            "中指研究院房价监测"
          ],
          methodology: "采用时间序列分析结合ARIMA模型，结合政策影响因子和宏观经济指标进行预测",
          assumptions: [
            "政策调控力度保持相对稳定",
            "经济基本面不发生重大变化",
            "人口流动趋势延续当前模式",
            "土地供应政策保持连续性"
          ],
          confidence: "预测置信度为75%，主要基于历史数据稳定性和政策可预期性",
          limitations: [
            "未考虑突发政策变化影响",
            "宏观经济波动影响有限",
            "区域发展不平衡因素未完全纳入",
            "国际环境变化影响有限"
          ],
          keyFactors: [
            "政策调控周期（约3-5年）",
            "经济周期波动（GDP增速变化）",
            "供需关系变化（人口流动、土地供应）",
            "市场心理预期（投资者信心）"
          ],
          trendExplanation: "房价波动主要受政策调控周期影响，2025-2027年可能经历调整期，2028-2030年政策放松带来反弹，2031-2035年回归理性区间。租售比上升反映租金相对稳定而房价调整的趋势。",
          marketContext: "当前房地产市场处于调整期，政策强调'房住不炒'，预计未来将更加注重市场稳定和健康发展。上海作为一线城市，房价调整幅度相对温和，长期仍具有投资价值。"
        }
      }
    }
     } else if (userQuery.includes('GDP') || userQuery.includes('经济')) {
     return {
       success: true,
       data: {
         chartType: 'line',
         title: '中国GDP增长趋势 (2020-2030)',
         subtitle: '年度GDP增长率预测 - 体现经济周期波动',
         xAxis: {
           name: '年份',
           data: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
         },
         yAxis: {
           name: 'GDP增长率 (%)'
         },
         series: [
           {
             name: 'GDP增长率',
             data: [2.3, 8.1, 3.0, 5.2, 5.8, 5.4, 6.2, 5.9, 6.5, 6.1, 6.8],
             type: 'line'
           }
         ],
         legend: ['GDP增长率'],
         tooltip: 'GDP增长率',
         description: '预计未来几年中国经济将保持稳定增长，GDP增长率在5-7%区间内波动，体现经济周期的自然起伏。',
         dataAnalysis: {
           dataSources: [
             "国家统计局GDP数据",
             "IMF经济展望报告",
             "世界银行发展指标",
             "央行货币政策报告"
           ],
           methodology: "采用经济周期分析模型，结合政策影响因子和外部环境变化进行预测",
           assumptions: [
             "全球经济环境相对稳定",
             "国内政策保持连续性",
             "产业结构调整持续推进",
             "科技创新驱动增长"
           ],
           confidence: "预测置信度为70%，主要基于经济周期规律和政策可预期性",
           limitations: [
             "未考虑重大外部冲击",
             "国际环境变化影响有限",
             "政策调整时机难以预测"
           ],
           keyFactors: [
             "政策调控周期",
             "全球经济复苏",
             "产业结构升级",
             "科技创新驱动"
           ],
           trendExplanation: "GDP增长率呈现波浪式变化，2025-2026年可能经历调整期，2027-2028年政策刺激带来反弹，2029-2030年回归稳定增长轨道。",
           marketContext: "中国经济正处于高质量发展阶段，政策强调稳增长与调结构的平衡，预计未来将呈现更加健康可持续的增长模式。"
         }
       }
     }
  } else {
    // 默认返回一个简单的折线图
    return {
      success: true,
      data: {
        chartType: 'line',
        title: '示例数据趋势',
        subtitle: '基于用户查询生成的示例图表',
        xAxis: {
          name: '时间',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          name: '数值'
        },
        series: [
          {
            name: '数据系列',
            data: [120, 132, 101, 134, 90, 230],
            type: 'line'
          }
        ],
        legend: ['数据系列'],
        tooltip: '数据趋势',
        description: '这是一个示例图表，展示了数据的趋势变化。'
      }
    }
  }
}

// 构建智能分析的提示词
function buildAnalysisPrompt(data, analysisType) {
  if (analysisType === 'chartType') {
    return `你是一个专业的数据分析师。请分析以下数据，推荐最适合的图表类型。

数据内容：${data}

请按照以下JSON格式返回分析结果：

{
  "confidence": 置信度百分比(0-100),
  "recommendedCharts": [
    {
      "type": "图表类型(line/bar/pie/scatter等)",
      "reason": "推荐理由",
      "isPrimary": true/false
    }
  ]
}

注意事项：
1. 分析数据特征，推荐最合适的图表类型
2. 置信度要基于数据的清晰度和特征匹配度
3. 返回的必须是有效的JSON格式，不要包含其他文字说明`
  } else if (analysisType === 'chartInsight') {
    return `你是一个专业的数据分析师。请深度分析以下图表数据，提供专业的洞察。

图表数据：${data}

请按照以下JSON格式返回分析结果：

{
  "overview": "数据概览描述",
  "keyInsights": ["关键发现1", "关键发现2", "关键发现3"],
  "trendAnalysis": "趋势分析描述",
  "considerations": ["注意事项1", "注意事项2", "注意事项3"],
  "recommendations": "建议行动描述"
}

注意事项：
1. 提供专业、准确的数据洞察
2. 分析要基于数据特征，避免主观臆断
3. 返回的必须是有效的JSON格式，不要包含其他文字说明`
  }
}

// 构建图片分析的提示词
function buildImageAnalysisPrompt(imageData, analysisType) {
  if (analysisType === 'chartType') {
    return `你是一个专业的数据分析师和图表专家。请分析以下图片，识别图表类型并推荐最适合的展示方式。

图片数据：${imageData}

请按照以下JSON格式返回分析结果：

{
  "confidence": 置信度百分比(0-100),
  "recommendedCharts": [
    {
      "type": "图表类型(line/bar/pie/scatter等)",
      "reason": "推荐理由",
      "isPrimary": true/false
    }
  ],
  "imageDescription": "图片中图表的基本描述",
  "dataFeatures": ["数据特征1", "数据特征2", "数据特征3"]
}

注意事项：
1. 仔细分析图片中的图表类型和数据特征
2. 推荐最适合的图表展示方式
3. 置信度要基于图片的清晰度和图表识别准确度
4. 返回的必须是有效的JSON格式，不要包含其他文字说明`
  }
}

// 构建图表图片解读的提示词
function buildChartImageInsightPrompt(imageData) {
  return `你是一个专业的数据分析师和图表专家。请分析以下图表图片，提供深度的数据洞察和解读。

图片数据：${imageData}

请按照以下JSON格式返回分析结果：

{
  "overview": "图表数据概览描述",
  "keyInsights": ["关键发现1", "关键发现2", "关键发现3"],
  "trendAnalysis": "趋势分析描述",
  "considerations": ["注意事项1", "注意事项2", "注意事项3"],
  "recommendations": "建议行动描述"
}

注意事项：
1. 仔细分析图片中的图表数据，识别关键信息
2. 提供专业、准确的数据洞察
3. 分析要基于图表特征，避免主观臆断
4. 返回的必须是有效的JSON格式，不要包含其他文字说明`
}

// 智能分析数据
export async function analyzeData(data, analysisType) {
  try {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
      // 如果没有API密钥，返回模拟数据
      return await analyzeDataMock(data, analysisType)
    }

    const prompt = buildAnalysisPrompt(data, analysisType)
    
    const response = await api.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的数据分析师，专门负责数据分析和图表解读。请严格按照要求的JSON格式返回结果。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    // 解析返回的内容
    const content = response.data.choices[0].message.content
    
    // 尝试提取JSON数据
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysisResult = JSON.parse(jsonMatch[0])
      return {
        success: true,
        data: analysisResult
      }
    } else {
      throw new Error('无法解析返回的JSON数据')
    }
    
  } catch (error) {
    console.error('AI分析失败:', error)
    return {
      success: false,
      error: error.message || 'AI分析失败'
    }
  }
}

// 图片分析API
export async function analyzeImageAPI(imageData, analysisType) {
  try {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
      // 如果没有API密钥，返回模拟数据
      return await analyzeImageMock(analysisType)
    }

    const prompt = buildImageAnalysisPrompt(imageData, analysisType)
    
    const response = await api.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的数据分析师和图表专家，专门负责图片中的图表识别和分析。请严格按照要求的JSON格式返回结果。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    // 解析返回的内容
    const content = response.data.choices[0].message.content
    
    // 尝试提取JSON数据
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysisResult = JSON.parse(jsonMatch[0])
      return {
        success: true,
        data: analysisResult
      }
    } else {
      throw new Error('无法解析返回的JSON数据')
    }
    
  } catch (error) {
    console.error('图片分析失败:', error)
    return {
      success: false,
      error: error.message || '图片分析失败'
    }
  }
}

// 图表图片解读API
export async function analyzeChartImageAPI(imageData) {
  try {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
      // 如果没有API密钥，返回模拟数据
      return await analyzeChartImageMock()
    }

    const prompt = buildChartImageInsightPrompt(imageData)
    
    const response = await api.post('', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的数据分析师和图表专家，专门负责图表图片中的数据解读和洞察分析。请严格按照要求的JSON格式返回结果。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    // 解析返回的内容
    const content = response.data.choices[0].message.content
    
    // 尝试提取JSON数据
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysisResult = JSON.parse(jsonMatch[0])
      return {
        success: true,
        data: analysisResult
      }
    } else {
      throw new Error('无法解析返回的JSON数据')
    }
    
  } catch (error) {
    console.error('图表图片解读失败:', error)
    return {
      success: false,
      error: error.message || '图表图片解读失败'
    }
  }
}

// 模拟智能分析（用于演示，当没有真实API密钥时）
export async function analyzeDataMock(data, analysisType) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  if (analysisType === 'chartType') {
    return {
      success: true,
      data: {
        confidence: 95,
        recommendedCharts: [
          {
            type: 'line',
            reason: '数据呈现时间序列特征，适合展示趋势变化',
            isPrimary: true
          },
          {
            type: 'bar',
            reason: '数据包含分类对比，适合展示数值差异',
            isPrimary: false
          },
          {
            type: 'scatter',
            reason: '数据点分布显示相关性，适合分析关联性',
            isPrimary: false
          }
        ]
      }
    }
  } else if (analysisType === 'chartInsight') {
    return {
      success: true,
      data: {
        overview: '这是一个展示月度销售趋势的折线图，数据覆盖了6个月的时间跨度，销售额从1月的120万元波动变化到6月的230万元。',
        keyInsights: [
          '6月份销售额达到峰值230万元，环比增长显著',
          '2-3月期间销售额出现下降趋势，需要关注原因',
          '整体趋势呈现上升态势，市场表现良好'
        ],
        trendAnalysis: '从数据可以看出，销售额整体呈现波动上升趋势。虽然2-3月出现短暂下滑，但4月开始恢复增长，6月达到历史高点，表明业务发展势头强劲。',
        considerations: [
          '数据样本相对较少，建议收集更多历史数据',
          '2-3月下滑可能与季节性因素或市场变化有关',
          '需要结合其他指标进行综合分析'
        ],
        recommendations: '建议继续保持当前的增长策略，同时深入分析2-3月下滑原因，制定相应的风险应对措施。可以考虑扩大数据收集范围，建立更完善的监控体系。'
      }
    }
  }
}

// 模拟图片分析（用于演示，当没有真实API密钥时）
export async function analyzeImageMock(analysisType) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  if (analysisType === 'chartType') {
    return {
      success: true,
      data: {
        confidence: 88,
        recommendedCharts: [
          {
            type: 'line',
            reason: '图片显示的是时间序列数据，适合用折线图展示趋势变化',
            isPrimary: true
          },
          {
            type: 'area',
            reason: '数据变化较为平滑，面积图可以更好地展示数据量',
            isPrimary: false
          }
        ],
        imageDescription: '这是一个展示月度销售数据的折线图，包含6个数据点，整体呈现上升趋势',
        dataFeatures: [
          '时间序列数据（月度）',
          '单一数值指标（销售额）',
          '整体上升趋势'
        ]
      }
    }
  }
}

// 模拟图表图片解读（用于演示，当没有真实API密钥时）
export async function analyzeChartImageMock() {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  return {
    success: true,
    data: {
      overview: '这是一个展示2024年各季度销售业绩的柱状图，数据覆盖了四个季度，从Q1的120万元增长到Q4的280万元，整体呈现稳步上升趋势。',
      keyInsights: [
        'Q4季度销售额达到峰值280万元，环比Q3增长25%',
        'Q2-Q3期间增长相对平缓，可能与季节性因素有关',
        '全年销售额呈现阶梯式增长，市场表现强劲'
      ],
      trendAnalysis: '从图表可以看出，销售业绩呈现明显的上升趋势，每个季度都有不同程度的增长。Q1作为开局季度表现稳健，Q2-Q3保持稳定增长，Q4实现突破性增长，表明业务发展势头强劲，市场策略有效。',
      considerations: [
        'Q2-Q3增长放缓需要关注，可能与市场周期或竞争环境变化有关',
        'Q4大幅增长需要分析是否具有可持续性',
        '建议结合其他业务指标进行综合分析'
      ],
      recommendations: '建议继续保持当前的业务策略，重点关注Q4增长因素的可持续性分析。同时，深入分析Q2-Q3增长放缓的原因，制定相应的优化措施。可以考虑扩大数据收集范围，建立更完善的业务监控体系。'
    }
  }
}

// 导出API配置信息
export const API_CONFIG = {
  DEEPSEEK_API_URL,
  DEEPSEEK_API_KEY
}
