<template>
  <div class="time-unit-editor">
    <h3>{{ title }}</h3>

    <el-radio-group v-model="mode" @change="handleModeChange" class="mode-selector">
      <el-radio-button label="all">任意</el-radio-button>
      <el-radio-button label="range">范围</el-radio-button>
      <el-radio-button label="step">间隔</el-radio-button>
      <el-radio-button label="specify">指定</el-radio-button>
      <el-radio-button v-if="otherOptions != undefined && otherOptions.length > 0" label="other"
        >其他</el-radio-button
      >
      <!-- <el-radio-button label="no-specify">不指定</el-radio-button>
      <el-radio-button label="lastDay">最后一天</el-radio-button> -->
    </el-radio-group>

    <!-- 范围选择 -->
    <div v-if="mode === 'range'" class="range-selector">
      <div class="range-slider">
        <el-slider
          v-model="rangeValue"
          range
          :min="min"
          :max="max"
          :step="step"
          @change="handleRangeChange"
          show-stops
        >
        </el-slider>
      </div>
      <div class="range-inputs">
        <el-input-number
          v-model="rangeValue[0]"
          :min="min"
          :max="rangeValue[1]"
          :step="step"
          @change="handleRangeChange"
        >
        </el-input-number>
        <span class="range-separator">至</span>
        <el-input-number
          v-model="rangeValue[1]"
          :min="rangeValue[0]"
          :max="max"
          :step="step"
          @change="handleRangeChange"
        >
        </el-input-number>
      </div>
    </div>

    <!-- 间隔选择 -->
    <div v-if="mode === 'step'" class="step-selector">
      <el-select v-model="stepValue" placeholder="请选择间隔" @change="handleStepChange">
        <el-option v-for="n in stepOptions" :key="n" :label="'每隔' + n + '天'" :value="n">
        </el-option>
      </el-select>
    </div>
    <!-- 其他选择 -->
    <div v-if="mode === 'other'" class="step-selector">
      <el-select v-model="otherValue" placeholder="请选择" @change="handleOtherChange">
        <el-option v-for="n in otherOptions" :key="n.value" :label="n.label" :value="n.value">
        </el-option>
      </el-select>
    </div>
    <!-- 指定选择 -->
    <div v-if="mode === 'specify'" class="specify-selector">
      <el-select
        v-model="selectedValues"
        multiple
        placeholder="请选择具体值"
        @change="handleSpecifyChange"
      >
        <el-option v-for="n in options" :key="n" :label="n" :value="n"> </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'SpecialOptionEditor',
  props: {
    title: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    other: {
      type: Array,
      required: false,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const mode = ref('all') // all, range, step, specify
    const selectedValues = ref([])
    const rangeValue = ref([props.min, props.max])
    const stepValue = ref(props.step)
    const otherValue = ref('')
    const other = ref(props.other)
    // 解析初始值
    const parseInitialValue = () => {
      console.log('props')
      console.log(props)
      if (!props.value) {
        mode.value = 'all'
        return
      }

      if (props.value === '*') {
        mode.value = 'all'
      } else if (props.value.includes('-')) {
        mode.value = 'range'
        const [start, end] = props.value.split('-').map(Number)
        if (!isNaN(start) && !isNaN(end)) {
          rangeValue.value = [start, end]
        }
      } else if (props.value.startsWith('*/')) {
        mode.value = 'step'
        const step = parseInt(props.value.split('/')[1])
        if (!isNaN(step)) {
          stepValue.value = step
        }
      } else if (props.value.includes(',')) {
        mode.value = 'specify'
        selectedValues.value = props.value
          .split(',')
          .map(Number)
          .filter((n) => !isNaN(n))
      } else if (!isNaN(Number(props.value))) {
        mode.value = 'specify'
        selectedValues.value = [Number(props.value)]
      } else if (other.value.some((item) => item.value === props.value)) {
        mode.value = 'other'
        otherValue.value = props.value
      } else {
        mode.value = 'all'
      }
    }

    // 生成可选数字
    const options = computed(() => {
      const nums = []
      for (let i = props.min; i <= props.max; i++) {
        nums.push(i)
      }
      return nums
    })

    // 生成间隔选项
    const stepOptions = computed(() => {
      const steps = []
      for (let i = 1; i <= props.max - props.min; i++) {
        steps.push(i)
      }
      return steps
    })
    // 生成其他选项
    const otherOptions = computed(() => {
      const item = [...other.value]
      return item
    })
    // 处理模式变化
    const handleModeChange = () => {
      switch (mode.value) {
        case 'all':
          emit('update', '*')
          break
        case 'range':
          handleRangeChange()
          break
        case 'step':
          handleStepChange()
          break
        case 'other':
          handleOtherChange()
          break
        case 'specify':
          handleSpecifyChange()
          break
      }
    }

    // 处理范围选择变化
    const handleRangeChange = () => {
      emit('update', `${rangeValue.value[0]}-${rangeValue.value[1]}`)
    }

    // 处理间隔选择变化
    const handleStepChange = () => {
      emit('update', `*/${stepValue.value}`)
    }
    // 处理其他选择变化
    const handleOtherChange = (val) => {
      if (!otherValue.value) {
        if (val !== undefined) {
          ElMessage({
            message: '最少选择一个,初始化为默认值',
            type: 'error',
          })
        }
        otherValue.value = props.other[0].value
        emit('update', otherValue.value)
        return
      } else {
        emit('update', otherValue.value)
      }
    }
    // 移除选项标签处理
    // const handleSpecifyRemoveTag = (oldVal) => {
    //   if (selectedValues.value.length === 0) {
    //     ElMessage({
    //       message: '最少选择一个',
    //       type: 'error',
    //     })
    //     selectedValues.value.push(oldVal)
    //   }
    // }
    // 处理指定选择变化
    const handleSpecifyChange = (val) => {
      if (selectedValues.value.length === 0) {
        if (val !== undefined) {
          ElMessage({
            message: '最少选择一个,初始化为默认值',
            type: 'error',
          })
        }
        selectedValues.value.push(props.min)
        emit('update', selectedValues.value.join(','))
        return
      } else {
        emit('update', selectedValues.value.join(','))
      }
    }

    // 初始化时解析值
    parseInitialValue()

    const parseValue = (value) => {
      if (!value) {
        mode.value = 'all'
        return
      }

      if (value === '*') {
        mode.value = 'all'
      } else if (value.includes('-')) {
        mode.value = 'range'
        const [start, end] = value.split('-').map(Number)
        if (!isNaN(start) && !isNaN(end)) {
          rangeValue.value = [start, end]
        }
      } else if (value.startsWith('*/')) {
        mode.value = 'step'
        const step = parseInt(value.split('/')[1])
        if (!isNaN(step)) {
          stepValue.value = step
        }
      } else if (value.includes(',')) {
        mode.value = 'specify'
        selectedValues.value = value
          .split(',')
          .map(Number)
          .filter((n) => !isNaN(n))
      } else if (!isNaN(Number(value))) {
        mode.value = 'specify'
        selectedValues.value = [Number(value)]
      } else if (other.value.some((item) => item.value === props.value)) {
        mode.value = 'other'
        otherValue.value = props.value
      } else {
        mode.value = 'all'
      }
    }
    watch(
      () => props.value,
      (newValue) => {
        parseValue(newValue)
      },
      { immediate: true },
    )

    return {
      mode,
      options,
      stepOptions,
      otherOptions,
      selectedValues,
      rangeValue,
      stepValue,
      otherValue,
      handleModeChange,
      handleRangeChange,
      handleStepChange,
      handleOtherChange,
      handleSpecifyChange,
      // handleSpecifyRemoveTag,
    }
  },
}
</script>

<style scoped>
.time-unit-editor {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #eaeef2;
}

.time-unit-editor h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeef2;
  color: #1890ff;
}

.mode-selector {
  margin-bottom: 15px;
  overflow: auto;
}

.range-selector {
  margin-top: 15px;
}

.range-slider {
  margin-bottom: 20px;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-separator {
  padding: 0 5px;
}

.step-selector {
  margin-top: 10px;
}

.specify-selector {
  margin-top: 10px;
}
</style>
