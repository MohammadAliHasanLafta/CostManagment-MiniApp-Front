import { createRouter, createWebHistory } from 'vue-router';
import ExpensesPage from '../views/ExpensesPage.vue';
import IncomePage from '../views/IncomePage.vue';

const routes = [
  { path: '/', name: 'Expenses', component: ExpensesPage },
  { path: '/income', name: 'Income', component: IncomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;