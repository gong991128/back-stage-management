import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式表
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//  require styles 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 时间线
// import Timeline from './views/order/timeline/index'
// import TimelineItem from './views/order/timeline-item/index'
// Vue.use(Timeline)
// Vue.use(TimelineItem)


// 引入axios
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use((config) => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 在最后必须 return config
  return config;
});
Vue.prototype.$http = axios;

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

// 全局过滤器 时间  
Vue.filter('dateFormat', function (originVal) {
  const sj = new Date(originVal)

  const y = sj.getFullYear()
  const m = (sj.getMonth() + 1 + '').padStart(2, '0')
  const d = (sj.getDate() + '').padStart(2, '0')

  const hh = (sj.getHours() + '').padStart(2, '0')
  const mm = (sj.getMinutes() + '').padStart(2, '0')
  const ss = (sj.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
