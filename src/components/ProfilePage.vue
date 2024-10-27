<template>
    <div class="bg-[#ffffffb7] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00] mx-auto">
      <div class="flex justify-center mb-4">
        <img
          src="../assets/profile.png"
          alt="عکس پروفایل"
          class="w-32 h-32 rounded-full border-4 border-[#F37F00] shadow-lg object-cover" />
      </div>
  
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ userName }}</h2>
      <p class="text-gray-600 mb-4">{{ userEmail }}</p>
  
      <div class="space-y-4">
        <button
          @click="showEditModal = true"
          class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          ویرایش پروفایل
        </button>
  
        <button
          @click="logout"
          class="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          خروج از حساب
        </button>
      </div>
  
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h3 class="text-xl font-bold mb-4 text-gray-800">ویرایش پروفایل</h3>
          <form @submit.prevent="updateProfile">
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
                type="submit"
                class="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                ذخیره
              </button>
              <button
                @click="showEditModal = false"
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
  import axios from "axios";
  
  export default {
    props: ["userId", "phoneNumber", "firstName"],
    data() {
      return {
        id: "",
        profile: null,
        userName: "",
        userEmail: "",
        showEditModal: false,
      };
    },
    mounted() {
      this.getProfile();
    },
    methods: {
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
          this.userEmail = this.profile.email;
          this.id = this.profile.id;
        } catch (error) {
          console.error("مشکل در دریافت پروفایل:", error);
          alert("خطا در دریافت پروفایل.");
        }
      },
      async updateProfile() {
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
  