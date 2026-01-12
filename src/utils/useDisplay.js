import { ref, onMounted, onUnmounted } from 'vue'

export function useDisplay() {
  const isMobile = ref(false)
  const inputSize = ref('default')
  const dialogWidth = ref('50%')
  const paginationLayout = ref('total, sizes, prev, pager, next, jumper')

  const checkIsMobile = () => {
    isMobile.value = window.innerWidth <= 768
    inputSize.value = isMobile.value ? 'small' : 'default'
    dialogWidth.value = isMobile.value ? '90%' : '50%'
    paginationLayout.value = isMobile.value
      ? 'total, prev, pager, next'
      : 'total, sizes, prev, pager, next, jumper'
  }

  onMounted(() => {
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile)
  })

  return {
    isMobile,
    inputSize,
    dialogWidth,
    paginationLayout,
  }
}
