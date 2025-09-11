<script setup>
// import TimedTask from './TimedTask.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
let at = ref('')
at.value = route.params.id
</script>

<template>
  <span>{{ at }}</span>
</template>
