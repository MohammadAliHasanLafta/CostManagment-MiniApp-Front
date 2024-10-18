<template>
  <div id="app" class="min-h-screen bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center p-4">
    <div v-if="!isLoggedIn" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-2" dir="rtl">در حال بارگذاری...</h1>
      <h1 class="text-1xl font-bold text-gray-800 mb-10" dir="rtl">لطفاً شکیبا باشید! 🙏</h1>

      <div class="text-center">
        <div role="status">
          <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-blue-600 fill-blue-600"
               viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227..." fill="currentFill" />
          </svg>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">مدیریت هزینه‌ها</h2>

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

      <form @submit.prevent="addExpense" class="mb-4 space-y-4" dir="rtl">
        <input
          v-model="newExpenseTitle"
          placeholder="عنوان هزینه..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input
          v-model.number="newExpenseAmount"
          type="number"
          placeholder="مبلغ هزینه..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button
          type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          اضافه کردن هزینه
        </button>
      </form>

      <div v-if="expenses.length === 0" class="text-center">
        <p dir="rtl">هیچ هزینه‌ای ثبت نشده است.</p>
      </div>

      <div v-else class="overflow-y-auto max-h-40">
        <ul class="space-y-2" dir="rtl">
          <li
            v-for="expense in expenses"
            :key="expense.id"
            class="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
            <span>{{ expense.title }} - {{ expense.amount }} تومان</span>
            <div class="flex space-x-2">
              <button
                @click="togglePaid(expense)"
                class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-lg ml-2">
                {{ expense.isPaid ? 'واگرد پرداخت' : 'پرداخت شد' }}
              </button>
              <button
                @click="deleteExpense(expense.id)"
                class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg">
                حذف
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      income: 0,
      newExpenseTitle: '',
      newExpenseAmount: 0,
      expenses: [],
    };
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
    setIncome() {
      if (this.income > 0) {
        this.saveData();
        alert("حقوق ثبت شد!");
      }
    },
    addExpense() {
      if (this.newExpenseTitle && this.newExpenseAmount > 0) {
        this.expenses.push({
          id: Date.now(),
          title: this.newExpenseTitle,
          amount: this.newExpenseAmount,
          isPaid: false,
        });
        this.newExpenseTitle = '';
        this.newExpenseAmount = 0;
        this.saveData();
      }
    },
    togglePaid(expense) {
      expense.isPaid = !expense.isPaid;
      this.saveData();
    },
    deleteExpense(id) {
      this.expenses = this.expenses.filter(expense => expense.id !== id);
      this.saveData();
    },
    saveData() {
      const data = {
        income: this.income,
        expenses: this.expenses,
      };
      localStorage.setItem('expenseManagerData', JSON.stringify(data));
    },
    loadData() {
      const storedData = localStorage.getItem('expenseManagerData');
      if (storedData) {
        const { income, expenses } = JSON.parse(storedData);
        this.income = income;
        this.expenses = expenses;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.isLoggedIn = true;
      this.loadData();
    }, 2000);
  },
};
</script>

<style>
.line-through {
  text-decoration: line-through;
}
</style>
