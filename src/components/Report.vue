<template>
  <div class="h-screen w-screen flex justify-center items-center bg-[#ffffff9f]">
    <div class="p-6 w-full max-w-xs mx-auto mt-4 text-center report-container" dir="rtl">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">گزارش هزینه‌ها</h2>

      <label for="startDate" class="block text-gray-600 mb-2">از تاریخ :</label>
      <input type="date" v-model="startDate" id="startDate" class="input-field" />

      <label for="endDate" class="block text-gray-600 mt-4 mb-2">تا تاریخ :</label>
      <input type="date" v-model="endDate" id="endDate" class="input-field" />

      <button @click="generateReport" class="generate-button">تولید گزارش</button>

      <div v-if="showReport" class="modal" dir="rtl">
        <div class="modal-content">
          <div class="modal-header">
            <h4>گزارش هزینه‌ها</h4>
            <span class="close" @click="closePopup">&times;</span>
          </div>
          <div v-if="filteredAndGroupedData && Object.keys(filteredAndGroupedData).length" class="modal-body">
            <div v-for="(items, date) in filteredAndGroupedData" :key="date" class="day-group">
              <h4>روز {{ formatDate(date) }}</h4>
              <ul>
                <li v-for="item in items" :key="item.id">
                  عنوان: {{ item.title }} - مبلغ: {{ item.amount }} تومان
                </li>
              </ul>
            </div>
            <h4>جمع کل: {{ totalAmount }} تومان</h4>
          </div>
          <p v-else>هیچ داده‌ای برای نمایش وجود ندارد.</p>
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
      startDate: "",
      endDate: "",
      filteredAndGroupedData: null,
      totalAmount: 0,
      showReport: false,
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
  mounted() { 
    this.loadExpenses(); 
  },
  methods: {
    closePopup() {
      this.showReport = false;
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
    generateReport() {
      if (!this.startDate || !this.endDate) {
        alert("لطفاً تاریخ شروع و پایان را انتخاب کنید.");
        return;
      }

      console.log("تاریخ شروع:", this.startDate);
      console.log("تاریخ پایان:", this.endDate);

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999); 

      const filteredData = this.expenses.filter(item => {
        const createdAt = new Date(item.createdAt);
        console.log("تاریخ آیتم:", createdAt);
        return createdAt >= start && createdAt <= end;
      });

      console.log("داده‌های فیلتر شده:", filteredData);

      this.filteredAndGroupedData = filteredData.reduce((groups, item) => {
        const date = new Date(item.createdAt).toISOString().split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
        return groups;
      }, {});

      this.totalAmount = filteredData.reduce((total, item) => total + item.amount, 0);

      this.showReport = true;
    },
    formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('fa-IR', options);
      },

  }
};
</script>


<style scoped>
.report-container {
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 4px;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #5d91f3;
}

.generate-button {
  display: inline-block;
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background-color: #FF8100;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.generate-button:hover {
  background-color: #FF8100;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); 
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px 40px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  color: #333;
  animation: fadeIn 0.3s ease-in-out;
  direction: rtl; 
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
}

.modal-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #5d91f3;
  text-align: center;
}

.close {
  position: absolute;
  right: 0;
  color: #aaa;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover,
.close:focus {
  color: #FF5C5C; 
}

.modal-body {
  font-size: 1rem;
  color: #666;
  text-align: right;
}

.modal-body ul {
  list-style-type: decimal;
  list-style-position: inside; 
  padding: 0;
  margin: 0;
  max-height: 200px; 
  overflow-y: auto; 
}

.modal-body ul li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  text-align: right;
}

.modal-body ul li:last-child {
  border-bottom: none;
}

.modal-body ul::-webkit-scrollbar {
  width: 6px;
}

.modal-body ul::-webkit-scrollbar-thumb {
  background-color: #F37F00;
  border-radius: 10px;
}

.modal-body ul::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
.day-group {
  margin-top: 20px;
  padding: 10px;
  background-color: #f7f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.day-group h4 {
  margin-bottom: 10px;
  color: #333;
}

.day-group ul {
  list-style: none;
  padding: 0;
}

.day-group li {
  margin-bottom: 5px;
  color: #666;
}

.day-group li:last-child {
  margin-bottom: 0;
}
</style>
