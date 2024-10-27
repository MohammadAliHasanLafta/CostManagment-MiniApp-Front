
<template>
  <div id="app" class="background-container min-h-screen bg-gradient-to-center from-[#FFAB49] to-[#F5811E] flex items-center justify-center p-4">
    <div v-if="!isLoggedIn && !showOtp" class="bg-[#ffffffb0] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00]">

      <h1 class="text-2xl font-bold text-[#FF7B0E] mb-2" dir="rtl">در حال دریافت داده ها،</h1>
      <h1 class="text-1xl font-bold text-[#FF7B0E] mb-10" dir="rtl">لطفاً شکیبا باشید!🙏</h1>

      <div class="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-8 h-8 text-[#fba446bc] animate-spin dark:text-[#F37F00] fill-[#F37F00]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-else-if="showOtp" class="bg-[#ffffffb0] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00]">
      <h2 class="text-2xl font-bold mb-4" dir="rtl">ورود</h2>
      <form v-if="!otpSent" @submit.prevent="requestOtp" class="mb-4 space-y-4">
        <input v-model="phoneNumber" placeholder="شماره موبایل..." class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]" required  dir="rtl"/>
        <button v-if="!click" type="submit" class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white py-2 px-4 rounded-lg">درخواست کد</button>
        <div v-else class="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-8 h-8 text-[#fba446bc] animate-spin dark:text-[#F37F00] fill-[#F37F00]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      </form>

      <form v-else @submit.prevent="verifyOtp" class="space-y-4">
        <h2 class="text-0xl font-bold mb-0" dir="rtl">کد ارسال شده به {{ phoneNumber }} را وارد نمایید.</h2>
        <button @click="editPhoneNumber" class="text-sm text-blue-500 hover:underline">
            ویرایش شماره
        </button>
        <div class="flex justify-between space-x-2">
          <input v-for="(digit, index) in otpCode" :key="index" type="number" maxlength="1"
            v-model="otpCode[index]" 
            @input="moveToNext($event, index)" 
            @keydown.backspace="moveToPrev($event, index)"
            class="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg" />
        </div>
        <button @click="verifyOtp" 
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors">
          ثبت کد
        </button>
      </form>
    </div>
    <div v-else>
      <div class="flex flex-col">
        <router-view 
          :userId="userId" 
          :phoneNumber="phoneNumber" 
          :firstName="firstName"
          class="bg-[#ffffffb0] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00] mx-auto">
        </router-view>

        <nav 
          class="fixed bottom-0 right-0 w-full bg-[#ffffff00] text-[#285653] flex justify-around md:bottom-auto md:right-0 md:top-0 md:h-full md:w-48 md:flex-col md:justify-start" dir="rtl">
          <router-link
            to="/profile"
            class="flex flex-col items-center text-center text-base md:flex-row md:gap-2 md:px-4 py-2"
            active-class="text-[#e06411]"
          > 
            <i class="fa-solid fa-address-card text-xl"></i>
            <span>پروفایل</span>
          </router-link>

          <router-link
            to="/"
            class="flex flex-col items-center text-center text-base md:flex-row md:gap-2 md:px-4 py-2"
            active-class="text-[#e06411]"
          >
            <i class="fas fa-wallet text-xl"></i>
            <span>هزینه‌ها</span>
          </router-link>

          <router-link
            to="/income"
            class="flex flex-col items-center text-center text-base md:flex-row md:gap-2 md:px-4 py-2"
            active-class="text-[#e06411]"
          >
            <i class="fas fa-money-bill-wave text-xl"></i>
            <span>حقوق و مانده</span>
          </router-link>

          <router-link
            to="/otpsetting"
            class="flex flex-col items-center text-center text-base md:flex-row md:gap-2 md:px-4 py-2"
            active-class="text-[#e06411]"
          > 
            <i class="fa-solid fa-question text-xl"></i>
            <span>راهنما</span>
          </router-link>
        </nav>
      </div>
    </div> 
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      click: false,
      isLoading: false,
      isLoggedIn: false,
      newTodoTitle: '',
      todos: [],
      showOtp: false,
      otpSent: false,
      phoneNumber: null,
      otpCode: Array(6).fill(''),
      initData : null,
      userId: null, 
      lastName: null,
      firstName: null,
      error: null,
      log: null,
    };
  },
  async mounted() {
    const et = window.Eitaa.WebApp;
    this.initData = et?.initData || "";
    et.expand();

    

    if (this.initData != "") {
      await this.extractUserInfoFromInitData();
      window.Eitaa.WebApp.MainButton.enable();
      window.Eitaa.WebApp.MainButton.setParams({
        text: "هزینه ها",
        color: "#FF8100",
        text_color: "#FFFFFF",
      });
      window.Eitaa.WebApp.MainButton.show();
      window.Eitaa.WebApp.MainButton.onClick(() =>{
        this.$router.push({
          path: '/',
        });
      });
    } else {
      this.showOtp = true;  
    }
  },
  methods: {
    editPhoneNumber() {
      this.otpSent = false;
    },
    moveToNext(event, index) {
      const input = event.target;
      if (input.value.length === 1 && input.nextElementSibling) {
        input.nextElementSibling.focus();
      }
    },
    moveToPrev(event, index) {
      const input = event.target;
      if (event.key === 'Backspace' && input.value === '' && input.previousElementSibling) {
        input.previousElementSibling.focus(); 
      }
    },
    async requestOtp() {
      try {
        this.click = true; 
        await axios.post("https://costmanagementminiapp.runasp.net/send-otp", {
          phoneNumber: this.phoneNumber
        }, {
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        });
        this.otpSent = true;
      } catch (error) {
        console.error("Failed to request OTP:", error);
      }
    },
    async verifyOtp() {
      let response = "";
      try {
        response = await axios.post('https://costmanagementminiapp.runasp.net/verify-otp', {
          phoneNumber: this.phoneNumber,
          otp: this.otpCode.join('')
        }, {
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error("Failed to verify OTP:", error);
      } finally{
        if (response.status == 200) {
          this.isLoggedIn = true;
          this.showOtp = false;
        }
      }
    },
    editPhoneNumber() {
      this.otpSent = false;
      this.phoneNumber = ''; 
      this.otpCode = Array(6).fill(''); 
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    extractUserInfoFromInitData() {
      try {
        const params = new URLSearchParams(this.initData);
        const user = JSON.parse(params.get("user"));

        if (user && user.id) {
          this.userId = user.id;
          this.firstName = user.first_name || "ناشناس";
          this.lastName = user.last_name || "بدون نام‌کاربری";

          this.sendUserInfoToApi();
        } else {
          console.warn("User info not found in initData.");
          this.error = "مشکل در دریافت اطلاعات کاربر.";
        }
      } catch (error) {
        console.error("Failed to extract user info:", error);
        this.error = "احراز هویت ناموفق بود.";
      }
      
    },

    async sendUserInfoToApi() {
      let response = "";
      try {
        response = await axios.post("https://costmanagementminiapp.runasp.net/verify-initdata", {
          userId: this.userId,
          firstName: this.firstName,
          lastName: this.lastName,
          initdata: this.initData,
        }, {
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        });
        console.log(this.initData);
        console.log(response+" and user id = "+this.userId);
        console.log("User info sent to API successfully:", response.data);
      } catch (error) {
        console.error("Failed to send user info to API:", error);
        this.error = "ارسال اطلاعات کاربر به API ناموفق بود.";
      }
      finally{
        if(response.status == 200) {
          this.delay(500).then(() => {
            this.isLoggedIn = true;
            this.isExist = false;
          });
        }
      }
      
    },
    extractUserIdFromInitData() {
    try {
      const params = new URLSearchParams(this.initData);
      const user = JSON.parse(params.get("user"));

      if (user && user.id) {
        this.userId = user.id;
        this.log= "User ID: "+ this.userId;

         
      } else {
        console.warn("User ID not found in initData.");
        this.error = "مشکل در دریافت اطلاعات کاربر.";
      }
    } catch (error) {
      console.error("Failed to extract User ID:", error);
      this.error = "احراز هویت ناموفق بود.";
    }
    finally{
      this.delay(4000).then(() => {
        this.isLoggedIn = true;
      });
    }
  },
  },
};
</script>

<style>
.line-through {
  text-decoration: line-through;
}
.background-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  
  background-image: 
  url('https://todolistminiapp.netlify.app/background-72f6ad1d%201.svg');
  background-size:cover;
  background-position: center;
  background-repeat:repeat;
  background-color: #ffffff;
  background-blend-mode: multiply;
  

}
</style>



