<template>
  <div class="cron-editor">
    <!-- 输入区域 -->
    <div class="cron-input-section">
      <div class="input-group">
        <input
          type="text"
          class="cron-input"
          v-model="cronExpression"
          placeholder="例如: 0 0 2 * * ?"
          @input="handleInputChange"
        />
        <div class="rigin-button">
          <el-button @click="localParseExpression" type="primary" :loading="parseExpressionFlag"
            >解析</el-button
          >
          <el-button @click="resetExpression" type="primary">重置</el-button>
        </div>
      </div>
      <p>
        当前表达式: <strong>{{ cronExpression }}</strong>
      </p>
    </div>

    <!-- 编辑器区域 -->
    <div class="editor-section">
      <div class="left-panel">
        <TimeUnitEditor
          title="秒 (0-59)秒"
          :min="0"
          :max="59"
          :step="5"
          :value="seconds"
          @update="updateTimeUnit('seconds', $event)"
        />
        <TimeUnitEditor
          title="分 (0-59)分"
          :min="0"
          :max="59"
          :step="5"
          :value="minutes"
          @update="updateTimeUnit('minutes', $event)"
        />
        <TimeUnitEditor
          title="时 (0-23)时"
          :min="0"
          :max="23"
          :step="1"
          :value="hours"
          @update="updateTimeUnit('hours', $event)"
        />
      </div>

      <div class="right-panel">
        <SpecialOptionEditor
          title="日 (1-31)日"
          :min="1"
          :max="31"
          :step="1"
          :value="dayOfMonth"
          :other="dayOptions"
          @update="updateTimeUnit('dayOfMonth', $event)"
        />
        <!-- <SpecialOptionEditor
          title="月 (1-12)月"
          :options="monthOptions"
          :value="month"
          @update="updateTimeUnit('month', $event)"
        /> -->
        <TimeUnitEditor
          title="月 (1-12)月"
          :min="1"
          :max="12"
          :step="1"
          :value="month"
          @update="updateTimeUnit('month', $event)"
        />
        <SpecialOptionEditor
          title="周 (1-7)"
          :min="1"
          :max="7"
          :step="1"
          :value="dayOfWeek"
          :other="weekOptions"
          @update="updateTimeUnit('dayOfWeek', $event)"
        />
        <!-- <SpecialOptionEditor
          title="年 (可选)年"
          :options="yearOptions"
          :value="year"
          @update="updateTimeUnit('year', $event)"
        /> -->
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-section">
      <h3>执行时间预览</h3>
      <!-- <p>
        下次执行时间: <strong>{{ nextExecutionTime }}</strong>
      </p>-->

      <div class="next-times">
        <div class="time-item" v-for="(time, index) in nextExecutionTimes" :key="index">
          {{ time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import TimeUnitEditor from './TimeUnitEditor.vue'
import SpecialOptionEditor from './SpecialOptionEditor.vue'
import { valid, nextExecutions } from '../api/cronParser'
import { ElMessage } from 'element-plus'
export default {
  name: 'CronEditor',
  components: {
    TimeUnitEditor,
    SpecialOptionEditor,
  },
  props: {
    modelValue: {
      type: String,
      default: '10 10 10 * * *',
    },
    hideYear: {
      type: Boolean,
      default: false,
    },
    hideSeconds: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    // 数据定义
    const cronExpression = ref(props.modelValue)
    const nextExecutionTime = ref('')
    const nextExecutionTimes = ref([])
    const parseExpressionFlag = ref(false)
    // 选项定义
    const dayOptions = [
      { label: '不指定', value: '?' },
      { label: '本月最后一天', value: 'L' },
    ]

    const monthOptions = [
      { label: '每月', value: '*' },
      { label: '所有月份', value: 'JAN-DEC' },
    ]

    const weekOptions = [{ label: '不指定', value: '?' }]

    const yearOptions = [
      { label: '每年', value: '*' },
      { label: '2023-2030', value: '2023-2030' },
    ]

    onMounted(() => {
      if (cronExpression.value) {
        localParseExpression()
      }
    })
    const getNextExecutions = async (cron, count) => {
      const { code, msg, data } = await nextExecutions(cron, count)
      if (code == 200) {
        console.log(data)
        const times = data
        return times
      } else {
        console.log(msg)
        ElMessage({
          message: msg,
          type: 'error',
        })
      }
    }
    const isValidCron = async (cron) => {
      const { code, msg } = await valid(cron)
      if (code == 200) {
        return true
      } else {
        ElMessage({
          message: msg,
          type: 'error',
        })
        return false
      }
    }
    // 解析cron表达式
    const parseCronExpression = (expr) => {
      const parts = expr.split(' ')
      return {
        seconds: parts[0],
        minutes: parts[1],
        hours: parts[2],
        dayOfMonth: parts[3],
        month: parts[4],
        dayOfWeek: parts[5],
        year: parts[6] || '*',
      }
    }

    // 组合cron表达式
    const composeCronExpression = (parts) => {
      let expr = `${parts.seconds} ${parts.minutes} ${parts.hours} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`
      if (!props.hideYear && parts.year !== '*') {
        expr += ` ${parts.year}`
      }
      return expr
    }

    // 计算下次执行时间（模拟）
    const calculateNextExecutionTimes = async (expression) => {
      // 使用正确的解析方式

      // 获取下一次执行时间
      // const nextTime = interval.next().toDate()
      // nextExecutionTime.value = formatDate(nextTime)
      const times = await getNextExecutions(expression, 6)
      console.log('calculateNextExecutionTimes' + times)
      // 获取接下来5次执行时间
      // const times = []
      // for (let i = 0; i < 6; i++) {
      //   const next = interval.next().toDate()
      //   times.push(formatDate(next))
      // }
      if (times && times.length > 0) {
        nextExecutionTimes.value = times.map((date) => date.replace('T', ' '))
        ElMessage({
          message: '解析成功',
          type: 'success',
        })
      } else {
        nextExecutionTimes.value = []
      }
      parseExpressionFlag.value = false
    }
    // 辅助函数：格式化日期
    // const formatDate = (date) => {
    //   return date.toLocaleString('zh-CN', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit',
    //     hour12: false,
    //   })
    // }

    // 初始化
    const cronParts = ref(parseCronExpression(props.modelValue))
    // calculateNextExecutionTimes(props.modelValue)

    // 计算属性
    const seconds = computed(() => cronParts.value.seconds)
    const minutes = computed(() => cronParts.value.minutes)
    const hours = computed(() => cronParts.value.hours)
    const dayOfMonth = computed(() => cronParts.value.dayOfMonth)
    const month = computed(() => cronParts.value.month)
    const dayOfWeek = computed(() => cronParts.value.dayOfWeek)
    const year = computed(() => cronParts.value.year)

    // 更新时间单位
    const updateTimeUnit = (unit, value) => {
      cronParts.value = { ...cronParts.value, [unit]: value }
      updateCronExpression()
    }

    // 更新cron表达式
    const updateCronExpression = () => {
      const newExpression = composeCronExpression(cronParts.value)
      cronExpression.value = newExpression
      emit('update:modelValue', newExpression)
      emit('change', newExpression)
      debouncedCalculate(newExpression)
      // calculateNextExecutionTimes(newExpression)
    }
    // 处理输入变化
    const handleInputChange = (event) => {
      const value = event.target.value
      cronExpression.value = value
      // if (isValidCronExpression(value)) {
      //   cronExpression.value = value
      // }
    }

    const isValidCronExpression = async (expr) => {
      return await isValidCron(expr)
    }
    // const parts = expr.split(' ')
    // return parts.length >= 6 && parts.length <= 7

    // 解析表达式
    const localParseExpression = async () => {
      parseExpressionFlag.value = true
      nextExecutionTime.value = '无法计算执行时间: 无效的Cron表达式'
      nextExecutionTimes.value = []
      try {
        const flag = await isValidCronExpression(cronExpression.value)
        console.log(flag)
        if (!flag) {
          parseExpressionFlag.value = false
          return false
        }

        const parts = parseCronExpression(cronExpression.value)
        // 更新所有部分
        cronParts.value = {
          seconds: parts.seconds,
          minutes: parts.minutes,
          hours: parts.hours,
          dayOfMonth: parts.dayOfMonth,
          month: parts.month,
          dayOfWeek: parts.dayOfWeek,
          year: parts.year || '*',
        }

        // 触发更新
        updateCronExpression()
      } catch (error) {
        parseExpressionFlag.value = false
        console.log(error)
        console.error('Invalid cron expression:', error)
        // 可以添加用户提示
        // alert('无效的Cron表达式，请检查格式')
      }
    }
    // 重置表达式
    const resetExpression = () => {
      cronExpression.value = '10 10 10 * * *'
      localParseExpression()
    }
    /**
     * 防抖函数
     * @param {Function} func 需要防抖的函数
     * @param {number} delay 延迟时间(毫秒)
     * @param {boolean} immediate 是否立即执行第一次
     * @return {Function} 返回防抖处理后的函数
     */
    function debounce(func, delay = 300, immediate = false) {
      let timer = null
      let immediateExecuted = false

      return function (...args) {
        const context = this

        if (timer) {
          clearTimeout(timer)
          timer = null
          immediateExecuted = false
        }

        const shouldCallImmediate = immediate && !immediateExecuted

        if (shouldCallImmediate) {
          func.apply(context, args)
          immediateExecuted = true
        }

        timer = setTimeout(() => {
          timer = null
          immediateExecuted = false
          if (!immediate) {
            func.apply(context, args)
          }
        }, delay)
      }
    }
    const debouncedCalculate = debounce(calculateNextExecutionTimes, 2500)
    // 监听props变化
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== cronExpression.value) {
          cronExpression.value = newValue
          console.log('00')
          localParseExpression()
        }
      },
    )
    return {
      cronExpression,
      nextExecutionTime,
      nextExecutionTimes,
      dayOptions,
      monthOptions,
      weekOptions,
      yearOptions,
      seconds,
      minutes,
      hours,
      dayOfMonth,
      month,
      dayOfWeek,
      year,
      parseExpressionFlag,
      updateTimeUnit,
      handleInputChange,
      localParseExpression,
      resetExpression,
    }
  },
}
</script>

<style scoped>
.cron-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 15px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.cron-input-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #f9fbfd;
  border-radius: 6px;
  border: 1px solid #eaeef2;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.cron-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  min-height: 40px;
}

.cron-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.rigin-button {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.editor-section {
  display: grid;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
  align-content: start;
}

.preview-section {
  margin-top: 20px;
  padding: 20px;
  background: #f0f5ff;
  border-radius: 6px;
  border: 1px solid #adc6ff;
  flex-shrink: 0;
}

.preview-section h3 {
  margin-bottom: 15px;
  color: #096dd9;
  font-size: 1.2em;
}

.next-times {
  display: grid;
  gap: 12px;
  margin-top: 15px;
}

.time-item {
  padding: 12px;
  background: white;
  border-radius: 4px;
  border: 1px solid #adc6ff;
  text-align: center;
  word-break: break-word;
}

/* 响应式设计 - 移动端优先 */
/* 小屏手机 (≤576px) */
@media (max-width: 576px) {
  .cron-editor {
    padding: 0 10px 15px;
    min-height: 80vh;
    border-radius: 0;
    box-shadow: none;
  }

  .cron-input-section {
    padding: 15px 12px 12px;
    margin-bottom: 15px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .input-group {
    flex-direction: column;
    gap: 8px;
  }

  .cron-input {
    width: 100%;
    font-size: 14px;
  }

  .rigin-button {
    width: 100%;
    justify-content: stretch;
  }

  .rigin-button .el-button {
    flex: 1;
  }

  .editor-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .next-times {
    grid-template-columns: 1fr;
  }

  .preview-section {
    margin-top: 15px;
    padding: 15px;
  }

  .preview-section h3 {
    font-size: 1.1em;
  }
}

/* 平板端 (577px-768px) */
@media (min-width: 577px) and (max-width: 768px) {
  .editor-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .next-times {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面端 (≥769px) */
@media (min-width: 769px) {
  .editor-section {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .next-times {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 大桌面端 (≥1200px) */
@media (min-width: 1200px) {
  .next-times {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 触摸设备优化 */
@media (pointer: coarse) {
  .cron-input {
    min-height: 44px;
    font-size: 16px;
  }

  .el-button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* 横屏移动设备优化 */
@media (max-height: 500px) and (orientation: landscape) {
  .cron-editor {
    min-height: 100vh;
  }

  .cron-input-section {
    position: static;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .cron-input {
    border-width: 2px;
  }

  .time-item {
    border-width: 2px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .cron-input,
  .el-button {
    transition: none;
  }
}
</style>
