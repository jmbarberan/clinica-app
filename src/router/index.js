import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index";
import Pacientes from '../views/Pacientes.vue'
import Citas from '../views/Citas.vue'
import Inicio from '../views/Inicio.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: Inicio,    
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: Pacientes,
    meta: { loginRequired: true }
  },
  {
    path: '/citas',
    name: 'Citas',
    component: Citas,
    meta: { loginRequired: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes
})

router.beforeEach(async function(to, from, next) {  
  if (to.name !== 'Inicio') {
    if (to.matched.some(ruta => ruta.meta.loginRequired)) {
      if (store != null && store.getters.token.length > 0) {
        next();
      } else {
        return { name: 'Inicio' };
      }
    }
  }
});

export default router
