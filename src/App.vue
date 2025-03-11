<template>
  <div
    id="app"
    class="background-container min-h-screen bg-gradient-to-center from-[#FFAB49] to-[#F5811E] flex items-center justify-center p-4"
  >
    <div
      v-if="!isLoggedIn && !showOtp"
      class="bg-[#ffffffb0] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00]"
    >
      <h1 class="text-2xl font-bold text-[#FF7B0E] mb-2" dir="rtl">
        در حال دریافت داده ها،
      </h1>
      <h1 class="text-1xl font-bold text-[#FF7B0E] mb-10" dir="rtl">
        لطفاً شکیبا باشید!🙏
      </h1>
      <div class="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-8 h-8 text-[#fba446bc] animate-spin dark:text-[#F37F00] fill-[#F37F00]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div
      v-else-if="showOtp"
      class="bg-[#ffffffb0] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00]"
    >
      <h2 class="text-2xl font-bold mb-4" dir="rtl">ورود</h2>
      <form v-if="!otpSent" @submit.prevent="requestOtp" class="mb-4 space-y-4">
        <input
          v-model="phoneNumber"
          placeholder="شماره موبایل..."
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]"
          required
          dir="rtl"
        />
        <button
          v-if="!click"
          type="submit"
          class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white py-2 px-4 rounded-lg"
        >
          درخواست کد
        </button>
        <div v-else class="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-[#fba446bc] animate-spin dark:text-[#F37F00] fill-[#F37F00]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </form>

      <form v-else @submit.prevent="verifyOtp" class="space-y-4">
        <h2 class="text-0xl font-bold mb-0" dir="rtl">
          کد ارسال شده به {{ phoneNumber }} را وارد نمایید.
        </h2>
        <button
          @click="editPhoneNumber"
          class="text-sm text-blue-500 hover:underline"
        >
          ویرایش شماره
        </button>
        <div class="flex justify-between space-x-2">
          <input
            v-for="(digit, index) in otpCode"
            :key="index"
            type="number"
            maxlength="1"
            v-model="otpCode[index]"
            @input="moveToNext($event, index)"
            @keydown.backspace="moveToPrev($event, index)"
            class="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          />
        </div>
        <button
          @click="verifyOtp"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
        >
          ثبت کد
        </button>
      </form>
    </div>

    <div v-else>
      <div class="flex flex-col w-full">
        <router-view
          :userId="userId"
          :phoneNumber="phoneNumber"
          :firstName="firstName"
          :expenses="expenses"
          :mobile="mobile"
        />

        <nav
          class="fixed bottom-0 right-0 w-full shadow-lg flex justify-around items-center py-4 text-gray-600 border-t border-gray-200"
        >
          <router-link
            to="/profile"
            class="flex flex-col items-center text-center text-sm"
            active-class="text-[#FF8100]"
          >
            <i class="fa-solid fa-user text-2xl"></i>
          </router-link>
          <router-link
            to="/income"
            class="flex flex-col items-center text-center text-sm"
            active-class="text-[#FF8100]"
          >
            <i class="fa-solid fa-wallet text-2xl"></i>
          </router-link>
          <div
            @click="toggleDrawer"
            class="bg-[#FF8100] rounded-full p-4 text-white flex items-center justify-center shadow-lg border-4 border-white absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 cursor-pointer"
          >
            <i class="fa-solid fa-plus text-2xl"></i>
          </div>
          <router-link
            to="/report"
            class="flex flex-col items-center text-center text-sm"
            active-class="text-[#FF8100]"
          >
            <i class="fa-solid fa-clipboard-list text-2xl"></i>
          </router-link>
          <router-link
            to="/"
            class="flex flex-col items-center text-center text-sm"
            active-class="text-[#FF8100]"
          >
            <i class="fa-solid fa-house text-2xl"></i>
          </router-link>
        </nav>
      </div>
    </div>
    <div
      v-show="isDrawerOpen || isAnimating"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-end justify-center transition-opacity duration-300 ease-out"
      @click.self="closeDrawer"
      :class="{ 'opacity-100': isDrawerOpen, 'opacity-0': !isDrawerOpen }"
    >
      <div
        class="drawer bg-white rounded-t-2xl shadow-lg w-full p-6"
        :class="{
          'slide-up': isDrawerOpen,
          'slide-down': !isDrawerOpen && isAnimating,
        }"
        style="height: 100"
      >
        <div class="text-center mb-4">
          <h3 class="text-xl font-semibold">اضافه کردن هزینه</h3>
          <button
            @click="closeDrawer"
            class="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label
              for="expense-title"
              class="block text-gray-600 font-semibold pb-2"
              dir="rtl"
              >موضوع هزینه</label
            >
            <input
              v-model="newExpenseTitle"
              id="expense-title"
              type="text"
              placeholder="هزینه جدید..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]"
              required
              dir="rtl"
            />
          </div>

          <div class="mb-4">
            <label
              for="expense-amount"
              class="block text-gray-600 font-semibold pb-2"
              dir="rtl"
              >مبلغ هزینه</label
            >
            <input
              v-model="newExpenseAmount"
              id="expense-amount"
              type="number"
              placeholder="lمقدار هزینه..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]"
              required
              dir="rtl"
            />
          </div>

          <div class="flex justify-between space-x-4 mt-6">
            <button
              type="button"
              @click="closeDrawer"
              class="w-full bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
              dir="rtl"
            >
              لغو
            </button>
            <button
              type="submit"
              class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg"
              dir="rtl"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="settingshow"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-semibold mb-4" dir="rtl">تنظیمات</h2>
        <div class="mb-4">
          <label class="block text-gray-600 font-semibold pb-2" dir="rtl"
            >تغییر حالت نمایش</label
          >
          <select
            v-model="theme"
            @change="applyTheme"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37F00]"
          >
            <option value="light">حالت روشن</option>
            <option value="dark">حالت تاریک</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      hasPhone: false,
      click: false,
      isLoading: false,
      isLoggedIn: false,
      newExpenseTitle: "",
      newExpenseAmount: 0,
      expenses: [],
      showOtp: false,
      otpSent: false,
      phoneNumber: null,
      otpCode: Array(6).fill(""),
      initData: null,
      contactRequest: null,
      userId: null,
      lastName: null,
      firstName: null,
      mobile: null,
      error: null,
      log: null,
      isDrawerOpen: false,
      isAnimating: false,
      settingshow: false,
      theme: "light",
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
      window.Eitaa.WebApp.MainButton.onClick(() => {
        this.$router.push({
          path: "/",
        });
      });

      window.Eitaa.WebApp.SettingsButton.show();
      window.Eitaa.WebApp.SettingsButton.onClick(() => {
        this.openSettings();
        this.settingshow = true;
      });
    } else {
      this.showOtp = true;
    }

    this.checkAndRequestContact();
    this.applyTheme();
  },
  created() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.theme = savedTheme;
      this.applyTheme();
    }
  },
  methods: {
    openSettings() {
      this.settingshow = true;
    },
    closeSettings() {
      this.settingshow = false;
    },
    applyTheme() {
      const themeClass = this.theme === "dark" ? "dark-mode" : "light-mode";
      document.documentElement.classList.remove("light-mode", "dark-mode");
      document.documentElement.classList.add(themeClass);
      localStorage.setItem("theme", this.theme); // ذخیره حالت در لوکال استوریج
      this.closeSettings();
    },
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      this.applyTheme();
    },
    async sendMessengerPhone(contact) {
      try {
        console.log("reponse : " + contact.response);
        const decodedData = decodeURIComponent(contact.response);

        this.contactRequest = decodedData;
        console.log("decodedData : " + decodedData);

        const params = new URLSearchParams(decodedData);
        const contactJson = params.get("contact");

        if (contactJson) {
          const contactData = JSON.parse(contactJson);
          this.mobile = contactData.phone.replace("98", "0", 1);

          this.verifyContact();

          console.log(this.mobile);
          if (this.mobile != null) {
            sessionStorage.setItem("isPhoneShared", "true");
            console.log("Phone successfully shared.");
          } else {
            sessionStorage.setItem("isPhoneShared", "false");
            console.log("Error:", response.error);
          }
        }
      } catch (error) {
        console.error("Error processing contact data:", error);
      }
    },

    async checkAndRequestContact() {
      const et = window.Eitaa.WebApp;

      try {
        const response = await axios.get(
          `https://costmanagementminiapp.runasp.net/get-miniappuser-mobile?UserId=${this.userId}`,
          {
            headers: {
              accept: "*/*",
            },
          }
        );
        if (response.data == false) {
          et.requestContact((isShared) => {
            if (!isShared) {
              sessionStorage.setItem("isPhoneShared", "false");
            }
          });

          et.onEvent("contactRequested", (contact) => {
            this.sendMessengerPhone(contact);
          });
        } else {
          this.mobile = response.data;
          console.log("mobile : " + this.mobile);
        }
      } catch (error) {
        console.error("Error checking user phone:", error);
      }
    },

    async verifyContact() {
      try {
        const response = await axios.post(
          "https://costmanagementminiapp.runasp.net/verify-contact",
          {
            userId: this.userId,
            mobile: this.mobile,
            contactRequest: this.contactRequest,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    openDrawer() {
      this.isDrawerOpen = true;
      this.isAnimating = true;
    },
    closeDrawer() {
      this.isDrawerOpen = false;
      this.isAnimating = true;

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    },
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
    async loadData() {
      try {
        let response = null;
        if (this.userId) {
          response = await axios.get(
            `https://costmanagementminiapp.runasp.net/get-all-costs`,
            {
              params: { UserId: this.userId },
              headers: { Accept: "text/plain" },
            }
          );
        } else if (this.phoneNumber) {
          response = await axios.get(
            `https://costmanagementminiapp.runasp.net/get-all-costs`,
            {
              params: { PhoneNumber: this.phoneNumber },
              headers: { Accept: "text/plain" },
            }
          );
        } else {
          throw new Error("User ID یا شماره تلفن موجود نیست.");
        }
        this.expenses = response.data;
      } catch (error) {
        console.error("مشکل در دریافت هزینه ها :", error);
      }
    },
    async handleSubmit() {
      const payload = {
        titel: this.newExpenseTitle,
        amount: this.newExpenseAmount,
        userId: this.userId || 0,
        phoneNumber: this.phoneNumber || null,
      };

      try {
        const response = await fetch(
          "https://costmanagementminiapp.runasp.net/create-cost",
          {
            method: "POST",
            headers: {
              accept: "text/plain",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed: ${errorText}`);
        }

        const result = await response.json();
        console.log("Expense added successfully:", result);

        this.expenses.push(this.loadData());

        this.newExpenseTitle = "";
        this.newExpenseAmount = 0;
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("خطا در افزودن هزینه. لطفا دوباره تلاش کنید.");
      }

      this.closeDrawer();
    },
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
      if (
        event.key === "Backspace" &&
        input.value === "" &&
        input.previousElementSibling
      ) {
        input.previousElementSibling.focus();
      }
    },
    async requestOtp() {
      try {
        this.click = true;
        await axios.post(
          "https://costmanagementminiapp.runasp.net/send-otp",
          {
            phoneNumber: this.phoneNumber,
          },
          {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );
        this.otpSent = true;
      } catch (error) {
        console.error("Failed to request OTP:", error);
      }
    },
    async verifyOtp() {
      let response = "";
      try {
        response = await axios.post(
          "https://costmanagementminiapp.runasp.net/verify-otp",
          {
            phoneNumber: this.phoneNumber,
            otp: this.otpCode.join(""),
          },
          {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Failed to verify OTP:", error);
      } finally {
        if (response.status == 200) {
          this.isLoggedIn = true;
          this.showOtp = false;
        }
      }
    },
    editPhoneNumber() {
      this.otpSent = false;
      this.phoneNumber = "";
      this.otpCode = Array(6).fill("");
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
        // دریافت آی‌پی از سرویس ipify
        const ipResponse = await axios.get(
          "https://api64.ipify.org?format=json"
        );
        const userIp = ipResponse.data.ip; // استخراج مقدار IP

        response = await axios.post(
          "https://costmanagementminiapp.runasp.net/verify-initdata",
          {
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            initdata: this.initData,
            ipAddress: userIp, // ارسال آی‌پی به سرور
          },
          {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response + " and user id = " + this.userId);
        console.log("User info sent to API successfully:", response.data);
      } catch (error) {
        console.error("Failed to send user info to API:", error);
        this.error = "ارسال اطلاعات کاربر به API ناموفق بود.";
      } finally {
        if (response && response.status == 200) {
          this.isLoggedIn = true;
          this.isExist = false;
        }
      }
    },
    extractUserIdFromInitData() {
      try {
        const params = new URLSearchParams(this.initData);
        const user = JSON.parse(params.get("user"));

        if (user && user.id) {
          this.userId = user.id;
          this.log = "User ID: " + this.userId;
        } else {
          console.warn("User ID not found in initData.");
          this.error = "مشکل در دریافت اطلاعات کاربر.";
        }
      } catch (error) {
        console.error("Failed to extract User ID:", error);
        this.error = "احراز هویت ناموفق بود.";
      } finally {
        this.isLoggedIn = true;
      }
    },
  },
};
</script>

<style>
.light-mode {
  --background-color: #ffffff;
  --text-color: #333333;
  --navbar-background: #ffffff;
  --navbar-text: #333333;
  --icon-color: #ff8100;
}

.dark-mode {
  --background-color: #2c2c2c6c;
  --text-color: #333333;
  --navbar-background: #3c3c3c;
  --navbar-text: #f1f1f1;
  --icon-color: #ffab49;
}

@font-face {
  font-family: "Sahel";
  src: url("../src/assets/font/Sahel.woff") format("woff"),
    url("../src/assets/font/Sahel.ttf") format("truetype");
  font-weight: lighter;
  font-style: unset;
}

* {
  font-family: "Sahel", sans-serif;
}

.line-through {
  text-decoration: line-through;
}

.background-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("https://todolistminiapp.netlify.app/background-72f6ad1d%201.svg");
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  background-blend-mode: multiply;
  background-color: var(
    --background-color
  ); /* متغیر پس‌زمینه بر اساس حالت انتخاب شده */
  color: var(--text-color); /* رنگ متن بر اساس حالت انتخاب شده */
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

.drawer {
  transition: opacity 0.3s ease-out;
}

.drawer.slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

.drawer.slide-down {
  animation: slideDown 0.5s ease-out forwards;
}

nav {
  background-color: var(--navbar-background); /* رنگ پس‌زمینه نوار ناوبری */
  color: var(--navbar-text); /* رنگ متن نوار ناوبری */
  border-top: 1px solid var(--text-color); /* رنگ مرزی */
}

nav a {
  color: var(--navbar-text); /* رنگ لینک‌ها در نوار ناوبری */
}

nav a.active-class {
  color: var(--icon-color); /* رنگ آیکون فعال */
}

.bg-#FF8100 {
  background-color: var(
    --button-background
  ) !important; /* دکمه‌ها در حالت عادی */
}

.bg-#FF8100:hover {
  background-color: var(--button-hover) !important; /* دکمه‌ها در حالت هاور */
}
</style>
