<template>
     <div class="min-h-screen bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">مدیریت هزینه‌ها</h2>

      <!-- فرم برای اضافه کردن یا ویرایش هزینه -->
      <form @submit.prevent="handleSubmit" class="mb-4 space-y-4" dir="rtl">
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
          {{ editingExpense ? 'ویرایش هزینه' : 'اضافه کردن هزینه' }}
        </button>
      </form>

      <p class="mb-4" dir="rtl">مجموع هزینه‌ها: {{ totalExpenses }} تومان</p>

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
                @click="editExpense(expense)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 ml-2 rounded-lg">
                ویرایش
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
      newExpenseTitle: '',
      newExpenseAmount: 0,
      expenses: [],
      editingExpense: null, // برای ذخیره هزینه‌ای که در حال ویرایش است
    };
  },
  computed: {
    totalExpenses() {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    },
  },
  methods: {
    handleSubmit() {
      if (this.newExpenseTitle && this.newExpenseAmount > 0) {
        if (this.editingExpense) {
          // اگر در حال ویرایش هستیم
          this.editingExpense.title = this.newExpenseTitle;
          this.editingExpense.amount = this.newExpenseAmount;
          this.editingExpense = null;
        } else {
          // اگر هزینه جدید اضافه می‌کنیم
          this.expenses.push({
            id: Date.now(),
            title: this.newExpenseTitle,
            amount: this.newExpenseAmount,
          });
        }

        // پاک کردن فرم و ذخیره داده‌ها
        this.newExpenseTitle = '';
        this.newExpenseAmount = 0;
        this.saveData();
      }
    },
    editExpense(expense) {
      this.newExpenseTitle = expense.title;
      this.newExpenseAmount = expense.amount;
      this.editingExpense = expense; // تنظیم هزینه در حال ویرایش
    },
    deleteExpense(id) {
      this.expenses = this.expenses.filter(expense => expense.id !== id);
      this.saveData();
    },
    saveData() {
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
    },
    loadData() {
      const storedData = localStorage.getItem('expenses');
      if (storedData) {
        this.expenses = JSON.parse(storedData);
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
  </script>
  