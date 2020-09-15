import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: 'login' },
  
  { path: '/login', component: () => import('../components/Login.vue') },

  { path: '/home', component: () => import('../views/Home.vue') },


]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载路由守卫
router.beforeEach((to,from,next)=>{
  if(to.path == '/login') return next();
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})

export default router