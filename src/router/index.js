import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';
import MoviesByCategory from '../views/MoviesByCategory.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  { path: '/', name: 'Home', component: Home, meta: { auth: true } },
  { path: '/moviesByCategory', name: 'MoviesByCategory', component: MoviesByCategory, meta: { auth: true } },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

router.beforeEach((to, from, next) => {
  
  const loggedIn = localStorage.getItem('user') ? true : false;
  if (to.matched.some(record => record.meta.auth) && !loggedIn) {
    next('/login');
    return
  }
  if ((to.name == 'Login' || to.name == 'Register') && loggedIn){
    next('/');
    return
  }
  next();
});

export default router
