<template>
  <div class="app-container config-container">
    <el-tabs v-model="tab">
      <el-tab-pane v-for="(item, i) in tabs" :key="i" :label="item.label" :name="item.name">
        <banner v-if="item.name == 'banner'" />
        <bannerBottom v-if="item.name == 'bannerBottom'" />
        <trending v-if="item.name == 'trending'" />
        <launchpad v-if="item.name == 'launchpad'" />
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import banner from './banner';
import bannerBottom from './bannerBottom'
import trending from './trending'
import launchpad from './launchpad'
export default {
  components: {
    banner,
    bannerBottom,
    trending,
    launchpad
  },
  name: 'homeConfig',
  data () {
    return {
      tab: "banner",
      tabs: [
        { name: "banner", label: '首页开屏区配置' },
        { name: "bannerBottom", label: '开屏区下方配置' },
        { name: "trending", label: '时下流行区配' },
        { name: "launchpad", label: '发射日历区配置' },
      ],
    }
  }
}
</script>
<style lang="scss" scoped>
</style>


