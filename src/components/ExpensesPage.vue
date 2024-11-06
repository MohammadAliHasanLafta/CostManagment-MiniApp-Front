<template>
  <div @click.self="closeMenu" class="h-screen w-screen flex justify-center items-start bg-[#ffffff00]">
      <div class="p-6 w-full max-w-xs mx-auto mt-4 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">مدیریت هزینه‌ها</h2>
        
          <div v-if="expenses.length === 0" class="text-center">
            <p dir="rtl">هیچ هزینه‌ای ثبت نشده است.</p>
          </div>
          
          <div v-else class="custom-scroll overflow-y-auto">
            <p class="mb-4" dir="rtl">مجموع هزینه‌ها: {{ totalExpenses }} تومان</p>
            <ul class="space-y-3" dir="rtl">
              <li
                v-for="expense in expenses"
                :key="expense.id"
                class="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                <span>{{ expense.title }} - {{ expense.amount }} تومان</span>
                <div class="flex space-x-2">
                  <i @click="openEditModal(expense)" class="fa-solid fa-pencil text-yellow-500 py-1 px-2 ml-2"></i>
                  <i @click="deleteExpense(expense.id)" class="fas fa-trash-alt text-red-500 py-1 px-2"></i>
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
  </div>

</template>

<script>
import axios from 'axios';
export default {
  props: ['userId', 'phoneNumber', 'expenses'],
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
    async loadData(expenses) {
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
  },
  mounted(){
    this.loadData();
  },
  watch: {
    expenses: {
      handler(newExpense) {
        this.loadData(newExpense);
      },
      immediate: true,
      deep: true
    }
  },
};
</script>

<style>
  .custom-scroll {
    max-height: calc(90vh - 8rem); /* محدود کردن ارتفاع به اندازه صفحه */
    overflow-y: auto;
  }

  .custom-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scroll::-webkit-scrollbar-track {
    background: #f0f0f0;
  }

  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: #ff9500;
    border-radius: 10px;
    border: 2px solid #f0f0f0;
  }

  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #ff7a00;
  }
</style>