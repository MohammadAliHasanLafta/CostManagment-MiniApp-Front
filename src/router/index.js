import { createRouter, createWebHistory } from 'vue-router';
import ExpensesPage from '../components/ExpensesPage.vue';
import IncomePage from '../components/IncomePage.vue';
import Profile from '../components/ProfilePage.vue';
import OTPSetting from '../components/OTPSetting.vue';

const routes = [
  { path: '/', name: 'Expenses', component: ExpensesPage },
  { path: '/income', name: 'Income', component: IncomePage },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/otpsetting', name: 'OtpSetting', component: OTPSetting },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;