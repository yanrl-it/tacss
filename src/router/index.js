import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'

import Equipment from '@/views/Equipment.vue'
import Eqnav from '@/views/eqnav/Eqnav.vue'
import Eqstatus from '@/views/eqnav/standard/Eqstatus.vue'
import Eqinsetting from '@/views/eqnav/standard/Eqinsetting.vue'
import Eqeditsetting from '@/views/eqnav/standard/Eqeditsetting.vue'
import Eqexportsetting from '@/views/eqnav/standard/Eqexportsetting.vue'
import Eqsystem from '@/views/eqnav/standard/Eqsystem.vue'
import Nationalnav from '@/views/eqnav/Nationalnav.vue'
import Nationalstatus from '@/views/eqnav/national/Nationalstatus.vue'
import Nationalconfig from '@/views/eqnav/national/Nationalconfig.vue'
import Nationalaisle from '@/views/eqnav/national/Nationalaisle.vue'
import Nationaledit from '@/views/eqnav/national/Nationaledit.vue'
import Nationalsystem from '@/views/eqnav/national/Nationalsystem.vue'

import System from '@/views/System.vue'
import CodeAdd from '@/views/actionpage/CodeAdd.vue'
import ImportPage from '@/views/actionpage/ImportPage.vue'
import UpgradePage from '@/views/actionpage/UpgradePage.vue'
import ResetExportPage from '@/views/actionpage/ResetExportPage.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/Home/Dashboard',
        component: Dashboard,
        meta: {
          isLogin: true
        }
      },
      {
        path: '/Home/Equipment',
        component: Equipment,
        children: [
          {//导航
            path: '/Home/Equipment/eqnav/Eqnav',
            component: Eqnav,
            children: [
              {//设备状态
                path: '/Home/Equipment/eqnav/Eqstatus',
                component: Eqstatus,
                meta: {
                  isLogin: true
                }
              },
              {//输入设置
                path: '/Home/Equipment/eqnav/Eqinsetting',
                component: Eqinsetting,
                meta: {
                  isLogin: true
                }
              },
              {//编码设置
                path: '/Home/Equipment/eqnav/Eqeditsetting',
                component: Eqeditsetting,
                meta: {
                  isLogin: true
                }
              },
              {//输出设置
                path: '/Home/Equipment/eqnav/Eqexportsetting',
                component: Eqexportsetting,
                meta: {
                  isLogin: true
                }
              },
              {//系统设置
                path: '/Home/Equipment/eqnav/Eqsystem',
                component: Eqsystem,
                meta: {
                  isLogin: true
                }
              }
            ],
            meta: {
              isLogin: true
            }
          },
          {//国标导航
            path: '/Home/Equipment/eqnav/Nationalnav',
            component: Nationalnav,
            children: [
              {//设备状态
                path: '/Home/Equipment/eqnav/Nationalstatus',
                component: Nationalstatus,
                meta: {
                  isLogin: true
                }
              },
              {//国标配置
                path: '/Home/Equipment/eqnav/Nationalconfig',
                component: Nationalconfig,
                meta: {
                  isLogin: true
                }
              },
              {//通道管理
                path: '/Home/Equipment/eqnav/Nationalaisle',
                component: Nationalaisle,
                meta: {
                  isLogin: true
                }
              },
              {//编码设置
                path: '/Home/Equipment/eqnav/Nationaledit',
                component: Nationaledit,
                meta: {
                  isLogin: true
                }
              },
              {//国标系统设置
                path: '/Home/Equipment/eqnav/Nationalsystem',
                component: Nationalsystem,
                meta: {
                  isLogin: true
                }
              }
            ],
            meta: {
              isLogin: true
            }
          },
        ],
        meta: {
          isLogin: true
        }
      },
      {
        path: '/Home/System',
        component: System,
        meta: {
          isLogin: true
        }
      }
    ],
    meta: {
      isLogin: true
    }
  },
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
      isLogin: false
    }
  },
  {//添加配置
    path: '/Home/Equipment/CodeAdd',
    component: CodeAdd,
    meta: {
      isLogin: true
    }
  },
  {//导入配置
    path: '/Home/Equipment/ImportPage',
    component: ImportPage,
    meta: {
      isLogin: true
    }
  },
  {//升级配置
    path: '/Home/Equipment/UpgradePage',
    component: UpgradePage,
    meta: {
      isLogin: true
    }
  },
  {//导出、重启、恢复配置
    path: '/Home/Equipment/ResetExportPage',
    component: ResetExportPage,
    meta: {
      isLogin: true
    }
  },
  {
    path: '*',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
