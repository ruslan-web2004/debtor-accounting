import {createRouter, createWebHistory} from 'vue-router'
import Index from '@/views/Index.vue'
import Books from '@/views/Books.vue'
import Dabtors from '@/views/Dabtors.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/books',
      name: 'Books',
      component: Books
    },
    {
      path: '/dabtors',
      name: 'Dabtors',
      component: Dabtors
    }
  ]
})

export default router;