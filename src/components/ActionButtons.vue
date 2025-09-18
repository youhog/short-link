<template>
  <div class="action-buttons" v-if="shortUrl">
    <ActionButton
      :icon="copyIcon"
      @click="copyLink"
    >
      {{ copyBtnText }}
    </ActionButton>

    <ActionButton
      :icon="shareIcon"
      buttonClass="share"
      :animation="shareAnimation"
      :success="shareSuccess"
      @click="shareLink"
    >
      <span class="share-btn-text">{{ shareBtnText }}</span>
    </ActionButton>

    <ActionButton
      :icon="qrcodeIcon"
      buttonClass="qrcode"
      @click="emit('generate-qrcode')"
    >
      產生 QR Code
    </ActionButton>

    <ActionButton
      :icon="statsIcon"
      buttonClass="stats"
      @click="emit('show-stats')"
    >
      訪問統計
    </ActionButton>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ActionButton from './base/ActionButton.vue';
import copyIcon from '@/assets/images/copy.svg?raw';
import shareIcon from '@/assets/images/share.svg?raw';
import qrcodeIcon from '@/assets/images/qrcode.svg?raw';
import statsIcon from '@/assets/images/stats.svg?raw';

// 定義props和emits
const props = defineProps({
  shortUrl: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['generate-qrcode', 'show-stats', 'message']);

// 響應式狀態
const copyBtnText = ref('複製連結');
const shareBtnText = ref('分享連結');
const shareAnimation = ref(false);
const shareSuccess = ref(false);

// 複製連結
async function copyLink() {
  if (!props.shortUrl) {
    emit('message', '沒有可複製的短連結', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(props.shortUrl);
    emit('message', '複製成功', 'success');
    copyBtnText.value = '已複製';
    setTimeout(() => {
      copyBtnText.value = '複製連結';
    }, 2000);
  } catch (error) {
    fallbackLegacyCopy(props.shortUrl);
  }
}

// 分享連結
async function shareLink() {
  if (!props.shortUrl) {
    emit('message', '沒有可分享的短連結', 'error');
    return;
  }

  // 添加點擊動畫效果
  shareAnimation.value = true;
  setTimeout(() => {
    shareAnimation.value = false;
  }, 500);

  // 獲取設備類型資訊
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // 準備分享內容
  const shareTitle = '短連結分享';
  const shareText = isMobile ?
    '我產生了一個短連結，點擊訪問：' :
    '我透過短連結服務產生了一個連結，點擊訪問：';

  // 偵測是否支援Web Share API
  if (navigator.share) {
    try {
      shareBtnText.value = '分享中...';
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: props.shortUrl
      });

      // 分享成功
      shareSuccess.value = true;
      emit('message', '分享成功', 'success');
      shareBtnText.value = '已分享';

      // 恢復原始按鈕狀態
      setTimeout(() => {
        shareBtnText.value = '分享連結';
        shareSuccess.value = false;
      }, 2000);
    } catch (error) {
      console.error('分享失敗:', error);
      if (error.name === 'AbortError') {
        emit('message', '分享已取消', 'info');
      } else {
        // 根據設備類型提供不同的提示
        if (isMobile) {
          if (isIOS) {
            emit('message', '分享失敗，請嘗試使用Safari瀏覽器', 'info');
          } else if (isAndroid) {
            emit('message', '分享失敗，請嘗試使用Chrome瀏覽器', 'info');
          } else {
            emit('message', '分享失敗，已複製連結到剪貼簿', 'info');
          }
        } else {
          emit('message', '分享失敗，已複製連結到剪貼簿', 'info');
        }
        // 如果分享API失敗，退回到剪貼簿複製
        fallbackToCopy(props.shortUrl);
      }
      // 恢復原始按鈕狀態
      shareBtnText.value = '分享連結';
    }
  } else {
    // 如果瀏覽器不支援原生分享API
    if (isMobile) {
      emit('message', '您的瀏覽器不支援直接分享，已複製連結', 'info');
    } else {
      emit('message', 'PC端不支援直接分享，已複製連結到剪貼簿', 'info');
    }
    // 複製到剪貼簿
    fallbackToCopy(props.shortUrl);
  }
}

// 複製到剪貼簿的退回方案
async function fallbackToCopy(url) {
  try {
    // 嘗試使用現代Clipboard API
    await navigator.clipboard.writeText(url);
    emit('message', '連結已複製到剪貼簿，請手動分享', 'success');
  } catch (err) {
    console.error('Clipboard API失敗，嘗試備用方法:', err);
    // 如果Clipboard API失敗，使用傳統方法
    fallbackLegacyCopy(url);
  }
}

// 使用傳統方法複製到剪貼簿
function fallbackLegacyCopy(url) {
  try {
    // 建立一個臨時輸入框來複製
    const tempInput = document.createElement('input');
    tempInput.value = url;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(tempInput);

    if (successful) {
      emit('message', '連結已複製，請手動分享', 'success');
    } else {
      emit('message', '複製失敗，請手動複製連結', 'error');
    }
  } catch (err) {
    console.error('傳統複製方法失敗:', err);
    emit('message', '無法複製連結，請手動複製', 'error');
  }
}
</script>

<style scoped>
.action-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>