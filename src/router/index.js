import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: 'login' },

  { path: '/login', component: () => import('../components/Login.vue') },

  {
    path: '/home', redirect: '/welcome', component: () => import('../views/Home.vue'),
    children: [
      { path: '/welcome', component: () => import('../components/Welcome.vue') },
      { path: '/users', component: () => import('../views/user/Users.vue') },
      { path: '/rights', component: () => import('../views/power/Rights.vue') },
      { path: '/roles', component: () => import('../views/power/Roles.vue') },
      { path: '/categories', component: () => import('../views/goods/cate.vue') },
      { path: '/params', component: () => import('../views/goods/params.vue') },
    ]
  },


]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
