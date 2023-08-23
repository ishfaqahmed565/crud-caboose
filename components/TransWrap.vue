<script setup>
const props = defineProps({ show: Boolean });
</script>
<template>
  <Transition name="wrapper">
    <div v-show="show" class="relative z-[999]">
      <slot></slot>
    </div>
  </Transition>
</template>
<style scoped>
.wrapper-enter-active {
  animation-name: finished;
  animation-duration: 0.2s;
}

.wrapper-leave-active {
  animation: finished 0.2s reverse;
}

@keyframes finished {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
