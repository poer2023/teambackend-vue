import { createRouter, createWebHistory } from 'vue-router'
import VersionManage from '../App.vue'
import TeamEdit from '../TeamEdit.vue'

const routes = [
  {
    path: '/',
    redirect: '/version'
  },
  {
    path: '/version',
    name: 'VersionManage',
    component: VersionManage
  },
  {
    path: '/team-edit',
    name: 'TeamEdit',
    component: TeamEdit
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
