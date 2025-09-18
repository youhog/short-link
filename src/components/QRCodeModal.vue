<template>
  <div class="modal" :style="{ display: visible ? 'flex' : 'none' }">
    <div class="modal-content">
      <div class="modal-close" @click="emit('close')">×</div>
      <h3>短連結 QR Code</h3>
      <div class="qrcode-container">
        <canvas ref="qrCanvas"></canvas>
      </div>
      <p>掃描 QR Code 訪問短連結</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import QRCode from 'qrcode';

// 定義props和emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'error']);

// 引用canvas元素
const qrCanvas = ref(null);

// 產生 QR Code 的方法
const generateQRCode = () => {
  if (!props.url) return;

  QRCode.toCanvas(qrCanvas.value, props.url, (error) => {
    if (error) {
      console.error('QR Code generation error:', error);
      emit('error', '產生 QR Code 失敗');
    }
  });
};

// 監聽visible和url的變化
watch(() => props.visible, (newVal) => {
  if (newVal && props.url) {
    nextTick(() => {
      generateQRCode();
    });
  }
});

watch(() => props.url, (newVal) => {
  if (props.visible && newVal) {
    nextTick(() => {
      generateQRCode();
    });
  }
});

// 生命週期鉤子
onMounted(() => {
  // 點擊模態框外部關閉
  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('modal')) {
      emit('close');
    }
  };

  window.addEventListener('click', handleOutsideClick);

  // 組件卸載時移除事件監聽器
  onUnmounted(() => {
    window.removeEventListener('click', handleOutsideClick);
  });
});
</script>

<style scoped>
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  max-width: 90%;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #f0f0f0;
  color: #333;
}

.qrcode-container {
  margin: 16px 0;
  display: flex;
  justify-content: center;
}
</style>