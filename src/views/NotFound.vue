<template>
  <div class="not-found-container">
    <div class="max-w-2xl w-full text-center fade-in">
      <div class="mb-8">
        <h1 class="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 bounce-animation">
          404
        </h1>
      </div>

      <div class="mb-8 flex justify-center">
        <div class="bg-white rounded-full p-6 shadow-lg">
          <svg class="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </div>
      </div>

      <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        短網址不存在
      </h2>
      <p class="text-lg text-gray-600 mb-8 leading-relaxed">
        抱歉，您要找的短網址可能已過期、被刪除，或者輸入錯誤。<br>
        請檢查網址是否正確，或聯繫分享者獲取新的連結。
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="goHome" class="link-hover bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg">
          回到首頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.not-found-container {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff, #f0f0ff);
  min-height: calc(100vh - 70px); /* 減去 nav 高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.bounce-animation {
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.fade-in {
  animation: fadeIn 0.8s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.link-hover {
  transition: all 0.3s ease;
}
.link-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}
</style>