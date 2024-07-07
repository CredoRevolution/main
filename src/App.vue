<template>
  <div id="app">
    <MainView />
  </div>
</template>

<script>
import MainView from './components/MainView.vue'

export default {
  name: 'App',
  components: {
    MainView,
  },
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
