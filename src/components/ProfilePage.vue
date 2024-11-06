<template >
    <div @click.self="closeMenu" class="h-screen w-screen flex justify-center items-center bg-[#ffffff00]">
      <div class="p-6 max-w-md mx-4">
        <div class="text-center mb-6">
          <h2 class="font-semibold text-2xl text-gray-800 mt-2"></h2>
          <button @click="toggleMenu" class="absolute top-4 right-4">
            <i class="fa-solid fa-ellipsis-vertical text-gray-400"></i>
          </button>
          <div
            v-if="isMenuOpen"
            class="absolute top-12 right-4 bg-white border border-gray-200 shadow-lg rounded-lg w-44 z-10" dir="rtl">
            <button @click="showEditModal = true; isMenuOpen = false" class="w-full text-right text-gray-800 px-4 py-2 hover:bg-gray-100">
              <i class="fa-solid fa-pen pl-4"></i>
              ویرایش پروفایل
            </button>
            <button @click="signOut" class="w-full text-right text-gray-800 px-4 py-2 hover:bg-gray-100">
              <i class="fa-solid fa-gear pl-4"></i>
              تنظیمات
            </button>
            <button @click="logout" class="w-full text-right text-gray-800 px-4 py-2 hover:bg-gray-100 hover:text-red-600">
              <i class="fa-solid fa-right-from-bracket pl-4"></i>
              خروج از حساب
            </button>
          </div>
        </div>
  
        <div class="text-center mb-6">
          <img src="../assets/profile.png" alt="Profile Picture" class="w-20 h-20 rounded-full mx-auto border-4 border-[#F37F00] shadow-md object-cover" />
          <h2 class="text-lg font-semibold text-gray-800 mt-4">{{ userName }}</h2>
          <p class="text-gray-500 text-base">{{ mobile }}</p>
          <p class="text-gray-500 text-sm">{{ userEmail }}</p>
        </div>

        <div class="bg-gray-100 rounded-lg py-4 px-4 mb-6 shadow-sm">
          <div class="text-center mb-3">
            <h3 class="text-lg font-semibold text-gray-700">بهترین هزینه</h3>
          </div>
          <div v-if="minExpenseDay" class="flex justify-between items-center">
            <div class="text-center">
              <span
                class="text-lg font-bold text-[#FF5C5C]"
              >
                {{ formatDate(minExpenseDay.date) }}
              </span>
            </div>
            <div class="text-center pl-10">
              <span
                class="text-base font-bold text-[#5A8DEE]"
                dir="rtl"
              >
                {{ minExpenseDay.total }} تومان
              </span>
            </div>
          </div>
          <div v-else class="status-box" dir="rtl">
            <p>هیچ هزینه‌ای برای نمایش وجود ندارد.</p>
          </div>
      </div>
      <div 
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h3 class="text-xl font-bold mb-4 text-gray-800">ویرایش پروفایل</h3>
          <form @submit.prevent="updateProfile" >
            <div class="mb-4" dir="rtl">
              <input
                v-model="userName"
                placeholder="نام"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
            </div>
            <div class="mb-4" dir="rtl">
              <input
                v-model="userEmail"
                placeholder="ایمیل"
                type="email"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" />
            </div>
            <div class="flex space-x-2">
              <button
                @click="showEditModal = false"
                type="button"
                class="w-full bg-gray-400 hover:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                لغو
              </button>
              <button
                type="submit"
                class="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                ذخیره
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    props: ["userId", "phoneNumber", "firstName", "expenses", "mobile"],
    data() {
      return {
        isMenuOpen: false,
        id: "",
        profile: null,
        userName: "",
        userEmail: "",
        showEditModal: false,
        income: 0,
        expenses: [],
        minExpenseDay: null,
      };
    },
    computed: {
      totalExpenses() {
        return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      },
      remainingAmount() {
        return this.income - this.totalExpenses;
      },
      minExpenseDay() {
        const expenseByDay = this.expenses.reduce((groups, item) => {
            const date = new Date(item.createdAt).toISOString().split('T')[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(item);
            return groups;
        }, {});

        const expenseTotals = Object.entries(expenseByDay)
            .map(([date, items]) => {
                const totalForDay = items.reduce((sum, item) => sum + item.amount, 0);
                return { date, total: totalForDay };
            })
            .filter(day => day.total > 0); 

        if (expenseTotals.length === 0) return null;

        const minExpenseDay = expenseTotals.reduce((min, day) =>
            day.total < min.total ? day : min
        );

        return minExpenseDay;
    }
    },
    mounted() {
      this.getProfile();
      this.loadIncome();
    },
    watch: {
    expense: {
      handler(newExpense) {
        this.loadExpenses(newExpense);
      },
      immediate: true,
      deep: true
    }
  },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('fa-IR', options);
      },
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
      async getProfile() {
        try {
          const params = this.userId
            ? { UserId: this.userId }
            : { PhoneNumber: this.phoneNumber };
  
          const response = await axios.get(
            "https://costmanagementminiapp.runasp.net/get-profile",
            {
              params,
              headers: { Accept: "text/plain" },
            }
          );
  
          this.profile = response.data;
          
          if(this.firstName == null){
            this.userName = this.profile.userName;
          }
          else{
            this.userName = this.firstName;
          }
          if (this.profile.email == "example@gmail.com") {
            this.userEmail = "";
          }
          else {
            this.userEmail = this.profile.email;
          }
          this.id = this.profile.id;
        } catch (error) {
          console.error("مشکل در دریافت پروفایل:", error);
          alert("خطا در دریافت پروفایل.");
        }
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      closeMenu() {
        this.isMenuOpen = false;
      },
      async updateProfile() {
        this.isMenuOpen = false;
        try {
          const updatedProfile = {
            id: this.id,
            userName: this.userName,
            email: this.userEmail,
          };
  
          await axios.put(
            `https://costmanagementminiapp.runasp.net/update-profile/${this.id}`,
            updatedProfile,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          alert("پروفایل با موفقیت به‌روز شد!");
        } catch (error) {
          console.error("Failed to update profile:", error);
          alert("خطا در به‌روزرسانی پروفایل.");
        }
        this.showEditModal = false;
      },
      async logout() {
        this.isMenuOpen = false;
        try {
          const response = await axios.delete(
            `https://costmanagementminiapp.runasp.net/remove-profile/${this.id}`,
            { headers: { Accept: "*/*" } }
          );
  
          if (response.status === 200) {
            alert("پروفایل با موفقیت حذف شد!");
            if (window.Eitaa && window.Eitaa.WebApp.initData) {
              window.Eitaa.WebApp.close();
            } else {
              this.$router.push({ path: "/" });
              setTimeout(() => window.location.reload(), 50);
            }
          }
        } catch (error) {
          console.error("Failed to delete profile:", error);
          alert("خطا در حذف پروفایل.");
        }
      },
    },
  };
  </script>

  <style>

.status-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f7f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    max-width: 300px;
    text-align: center;
}

.status-box div {
    flex: 1;
}

.status-box div p {
    font-size: 14px;
    color: #333;
    margin: 0;
}

.status-box div h3 {
    margin: 5px 0;
    font-size: 22px;
    font-weight: bold;
    color: #e74c3c;
}

</style>
  