<template>
  <div class="bg-[#ffffffb7] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">مدیریت هزینه‌ها</h2>

    <form @submit.prevent="handleSubmit" class="mb-4 space-y-4" dir="rtl">
      <input
        v-model="newExpenseTitle"
        placeholder="عنوان هزینه..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
      <input
        v-model.number="newExpenseAmount"
        type="number"
        placeholder="مبلغ هزینه..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
      <button
        type="submit"
        class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        اضافه کردن هزینه
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
              @click="openEditModal(expense)"
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

    <div 
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h3 class="text-xl font-bold mb-4 text-gray-800">ویرایش هزینه</h3>
        <form @submit.prevent="editExpense">
          <div class="mb-4">
            <input
              v-model="editingExpense.title"
              placeholder="عنوان هزینه"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]"  dir="rtl"/>
          </div>
          <div class="mb-4">
            <input
              v-model.number="editingExpense.amount"
              placeholder="مبلغ هزینه"
              type="number"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]"  dir="rtl"/>
          </div>
          <div class="flex space-x-2">
            <button
              type="submit"
              class="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              ذخیره
            </button>
            <button
              @click="closeEditModal"
              type="button"
              class="w-full bg-gray-400 hover:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              لغو
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: ['userId', 'phoneNumber'],
  data() {
    return {
      newExpenseTitle: '',
      newExpenseAmount: 0,
      expenses: [],
      editingExpense: null, 
      showEditModal: false,
    };
  },
  computed: {
    totalExpenses() {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    },
  },
  methods: {
    async handleSubmit() {
      const payload = {
        titel: this.newExpenseTitle,
        amount: this.newExpenseAmount,
        userId: this.userId || 0,
        phoneNumber: this.phoneNumber || null,
      };

      try {
        const response = await fetch('https://costmanagementminiapp.runasp.net/create-cost', {
          method: 'POST',
          headers: {
            accept: 'text/plain',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed: ${errorText}`);
        }

        const result = await response.json();
        console.log('Expense added successfully:', result);

        this.newExpenseTitle = '';
        this.newExpenseAmount = 0;

        this.loadData();
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('خطا در افزودن هزینه. لطفا دوباره تلاش کنید.');
      }
    },
    openEditModal(expense) {
      this.editingExpense = { ...expense };
      this.showEditModal = true;
    },
    async editExpense() {
      try {
        await axios.put(
          `https://costmanagementminiapp.runasp.net/update-cost/${this.editingExpense.id}`,
          this.editingExpense,
          { headers: { 'Content-Type': 'application/json' } }
        );
        this.loadData();
        this.closeEditModal();
      } catch (error) {
        console.error('Failed to update expense:', error);
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editingExpense = null;
    },
    async deleteExpense(id) {
      try {
        await axios.delete(`https://costmanagementminiapp.runasp.net/remove-cost/${id}`, {
          headers: { 'accept': '*/*' }
        });

        this.expenses = this.expenses.filter(expense => expense.id !== id);
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    },
    saveData() {
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
    },
    async loadData() {
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
        this.expenses = response.data;
      } catch (error) {
        console.error('مشکل در دریافت هزینه ها :', error);
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

  