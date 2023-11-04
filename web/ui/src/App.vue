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

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
