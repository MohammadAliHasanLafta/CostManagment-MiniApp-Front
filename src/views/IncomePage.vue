<template>
    <div class="min-h-screen bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">مدیریت حقوق و مانده</h2>
  
        <form @submit.prevent="setIncome" class="mb-4 space-y-4" dir="rtl">
          <input
            v-model.number="income"
            type="number"
            placeholder="مبلغ حقوق ماهانه..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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
  export default {
    data() {
      return {
        income: 0,
        expenses: [],
      };
    },
    computed: {
      totalExpenses() {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        return storedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      },
      remainingAmount() {
        return this.income - this.totalExpenses;
      },
    },
    methods: {
      setIncome() {
        localStorage.setItem('income', this.income);
        alert('حقوق ثبت شد!');
      },
    },
    mounted() {
      const storedIncome = localStorage.getItem('income');
      if (storedIncome) {
        this.income = parseInt(storedIncome, 10);
      }
    },
  };
  </script>
  