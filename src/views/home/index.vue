<template>
  <div class="home-container">
    <div class="wrapper">
      <a
        href="https://github.com/Alessandro-Pang/short-link"
        class="github-link"
        target="_blank"
        ><span v-html="githubIcon"></span> GitHub
      </a>
      <header>短連結服務</header>

      <UrlInput
        v-model="urlInput"
        :icon="linkIcon"
        placeholder="輸入需要縮短的連結 (http://、https:// 或 #小程序://)"
        buttonText="產生短連結"
        @submit="generateShortLink"
      />

      <div class="custom-link-wrapper">
        <input
            type="text"
            v-model="customShort"
            placeholder="自訂連結 (選填，例如：my-link)"
            class="custom-link-input"
        />
      </div>


      <ShortLinkCard
        :shortUrl="currentShortUrl"
        :visible="responseVisible"
        :isError="isError"
      />

      <LoadingSpinner :active="isLoading">正在產生短連結...</LoadingSpinner>

      <ActionButtons
        :shortUrl="currentShortUrl"
        @generate-qrcode="showQRCodeModal"
        @show-stats="showStats"
        @message="showMessage"
      />

      <QRCodeModal
        :visible="qrcodeModalVisible"
        :url="currentShortUrl"
        @close="closeQRCodeModal"
        @error="showMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import githubIcon from '@/assets/images/github.svg?raw';
import linkIcon from '@/assets/images/link.svg?raw';
import ActionButtons from '@/components/ActionButtons.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import UrlInput from '@/components/base/UrlInput.vue';
import QRCodeModal from '@/components/QRCodeModal.vue';
import ShortLinkCard from '@/components/ShortLinkCard.vue';
import { addUrl, getStats } from '@/services/api.js';
import { showMessage } from '@/utils/message.js';
import { validateUrl } from '@/utils/validator.js';

// 響應式狀態
const urlInput = ref('');
const customShort = ref('');
const currentShortUrl = ref('');
const isLoading = ref(false);
const responseVisible = ref(false);
const isError = ref(false);
const qrcodeModalVisible = ref(false);

// 儲存到歷史紀錄
function saveToHistory(originalUrl, shortUrl) {
    const history = JSON.parse(localStorage.getItem('shortLinkHistory') || '[]');
    const newRecord = {
        originalUrl,
        shortUrl,
        createdAt: new Date().toLocaleString('zh-TW'),
    };
    // 新紀錄加到最前面
    history.unshift(newRecord);
    // 最多只儲存 50 筆
    if (history.length > 50) {
        history.pop();
    }
    localStorage.setItem('shortLinkHistory', JSON.stringify(history));
}


// 產生短連結
async function generateShortLink() {
  const inputUrl = urlInput.value.trim();
  if (!inputUrl) {
    showMessage('請輸入連結', 'error');
    return;
  }

  if (!validateUrl(inputUrl)) {
    showMessage(
      '請輸入有效的連結，必須以 http://、https:// 或 #小程序:// 開頭',
      'error'
    );
    return;
  }

  // 顯示載入狀態
  isLoading.value = true;
  responseVisible.value = false;

  try {
    // 使用 API 服務模組，並傳入自訂連結
    const data = await addUrl(inputUrl, customShort.value.trim());

    // 隱藏載入狀態
    isLoading.value = false;

    // 設定目前短連結
    const newShortUrl = window.location.origin + data.url;
    currentShortUrl.value = newShortUrl;
    showMessage('短連結產生成功', 'success');
    
    // 儲存到歷史紀錄
    saveToHistory(inputUrl, newShortUrl);

    urlInput.value = '';
    customShort.value = '';
    responseVisible.value = true;
    isError.value = false;
  } catch (error) {
    isLoading.value = false;
    showMessage(`發生錯誤: ${error.message || '未知錯誤'}`, 'error');
    currentShortUrl.value = '';
    responseVisible.value = false;
  }
}

// 顯示 QR Code 模態框
function showQRCodeModal() {
  if (!currentShortUrl.value) {
    showMessage('沒有可產生 QR Code 的短連結', 'error');
    return;
  }
  qrcodeModalVisible.value = true;
}

// 關閉 QR Code 模態框
function closeQRCodeModal() {
  qrcodeModalVisible.value = false;
}

// 顯示統計資訊
async function showStats() {
  if (!currentShortUrl.value) {
    showMessage('沒有可查看統計的短連結', 'error');
    return;
  }
  try {
      const hash = currentShortUrl.value.split('/').pop();
      const response = await getStats(hash);
      const clicks = response.data.clicks;
      showMessage(`此連結已被點擊 ${clicks} 次`, 'info');
  } catch (error) {
      showMessage(error.message || '無法取得統計資料', 'error');
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.wrapper {
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  padding: 40px;
  min-width: 580px;
  max-width: 680px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #4776e6, #8e54e9);
}

.github-link {
  position: absolute;
  top: 16px;
  right: 16px;
  text-decoration: none;
  font-size: 14px;
  color: #6c5ce7;
  border: 1px solid #6c5ce7;
  padding: 8px 16px;
  border-radius: 50px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.github-link span {
  display: flex;
  align-items: center;
}

.github-link:hover {
  background: #6c5ce7;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(108, 92, 231, 0.2);
}

.github-link :deep(svg) {
  width: 16px;
  height: 16px;
}

header {
  font-size: 36px;
  margin-bottom: 30px;
  color: #2d3436;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

header::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #4776e6, #8e54e9);
  border-radius: 2px;
}

.custom-link-wrapper {
  margin-top: -16px; /* Offset the margin from UrlInput */
  margin-bottom: 16px;
}

.custom-link-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  text-align: center;
}

.custom-link-input:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.15);
  background-color: #fff;
}


@media screen and (max-width: 520px) {
  .wrapper {
    padding: 30px 20px;
    width: 100%;
    min-width: 0;
    border-radius: 12px;
  }

  header {
    font-size: 28px;
  }
}
</style>