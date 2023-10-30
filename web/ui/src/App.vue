<template>
  <MainControl />
</template>

<script>
import MainControl from './components/MainControl.vue'

export default {
  name: 'App',
  components: {
    MainControl
  }
}
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

#app {
  height: 100%;
  overflow: hidden;
}
</style>
