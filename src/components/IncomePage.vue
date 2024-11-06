<template>
  <div class="h-screen w-screen flex justify-center items-center bg-[#ffffff25]">
    <div class="p-6 w-full max-w-xs mx-auto mt-4 text-center">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">مدیریت حقوق و مانده</h2>

    <form @submit.prevent="setIncome" class="mb-4 space-y-4" dir="rtl">
      <input
        v-model.number="income"
        type="number"
        placeholder="مبلغ حقوق ماهانه..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
      <button
        type="submit"
        class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        ثبت حقوق
      </button>
    </form>

    <p class="mb-4" dir="rtl">حقوق ماهانه: {{ income }} تومان</p>
    <p class="mb-4" dir="rtl">مجموع هزینه‌ها: {{ totalExpenses }} تومان</p>
    <p class="mb-4" dir="rtl">باقی‌مانده: {{ remainingAmount }} تومان</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['userId', 'phoneNumber', 'expenses'],
  data() {
    return {
      income: 0,
      expenses: [],
    };
  },
  watch: {
    expenses: {
      handler(expenses) {
        this.loadExpenses(expenses);
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    totalExpenses() {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    },
    remainingAmount() {
      return this.income - this.totalExpenses;
    },
  },
  methods: {
    async loadIncome() {
      try {
        let response = null;
        if (this.userId) {
          response = await axios.get(`https://costmanagementminiapp.runasp.net/get-income`, {
            params: { UserId: this.userId },
            headers: { 'Accept': 'text/plain' },
          });
        } else if (this.phoneNumber) {
          response = await axios.get(`https://costmanagementminiapp.runasp.net/get-income`, {
            params: { PhoneNumber: this.phoneNumber },
            headers: { 'Accept': 'text/plain' },
          });
        } else {
          throw new Error('User ID یا شماره تلفن موجود نیست.');
        }
        this.income = response.data;
      } catch (error) {
        console.error('مشکل در دریافت هزینه ها :', error);
      }
    },
    async loadExpenses(expenses) {
      try {
        let response = null;
        if (this.userId) {
          response = await axios.get(`https://costmanagementminiapp.runasp.net/get-all-costs`, {
            params: { UserId: this.userId },
            headers: { 'Accept': 'text/plain' },
          });
        } else if (this.phoneNumber) {
          response = await axios.get(`https://costmanagementminiapp.runasp.net/get-all-costs`, {
            params: { PhoneNumber: this.phoneNumber },
            headers: { 'Accept': 'text/plain' },
          });
        } else {
          throw new Error('User ID یا شماره تلفن موجود نیست.');
        }
        expenses = response.data;
      } catch (error) {
        console.error('مشکل در دریافت هزینه ها :', error);
      }
      this.expenses = expenses;
    },
    async setIncome() {
      const newIncomeData = {
        salary: this.income,
        userId: this.userId || 0,
        phoneNumber: this.phoneNumber || null,
      };

      try {
        await axios.post('https://costmanagementminiapp.runasp.net/create-income', newIncomeData, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('حقوق ثبت شد!');
        this.loadIncome();
      } catch (error) {
        console.error('Failed to set income:', error);
        alert('خطا در ثبت حقوق');
      }
    },
  },
  mounted() {
    this.loadIncome(); 
    this.loadExpenses(); 
  },
};
</script>
