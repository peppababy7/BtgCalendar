import Vue from 'vue'
import App from './App.vue'

import 'element-ui/lib/theme-chalk/index.css'
import element from '../src/element/index'
Vue.use(element)

new Vue({
  el: '#app',
  render: h => h(App)
})
