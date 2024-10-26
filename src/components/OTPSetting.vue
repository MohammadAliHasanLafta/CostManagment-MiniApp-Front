<template>
    <div class="bg-[#ffffffb7] p-8 rounded-xl shadow-lg w-full max-w-md text-center border-solid border-2 border-[#F37F00] mx-auto">
      
      <div class="flex justify-center mb-4">
        <img
          src="https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-message-selected.png"
          alt="OTP"
          class="w-32 h-32 rounded-full border-4 border-[#F37F00] shadow-lg object-cover" />
      </div>
  
      <h2 class="text-1xl font-bold text-gray-800 mb-5" dir="rtl">راهنمای وصل کردن سیستم ارسال پیامک (OTP)</h2>
  
      <div class="space-y-4">
        <button
          @click="setting"
          class="w-full bg-[#FF8100] hover:bg-[#FFA242] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          راهنما
        </button>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
      };
    },
    methods: {
      async setting() {
        if(window.Eitaa.WebApp.initData){
          window.Eitaa.WebApp.openLink("https://kavenegar.com/rest.html");
        }
        
        window.open("https://kavenegar.com/rest.html", "_blank");
        this.$router.replace({
          path: '/',
        });
      },
    },
  };
  </script>
  