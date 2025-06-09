<template>
  <div class="wrapper" role="main">
    <a href="https://github.com/Alessandro-Pang/short-link" class="github-link" target="_blank">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
      GitHub
    </a>
    <header>短链接服务</header>
    <div class="url-wrapper">
      <div class="input-container">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
        </svg>
        <input type="text" id="url-input" v-model="urlInput" placeholder="输入需要缩短的链接 (http://、https:// 或 #小程序://)">
      </div>
      <input type="button" value="生成短链接" @click="generateShortLink">
    </div>
    <div class="response" :class="{ visible: responseVisible, error: isError }" aria-live="polite">
      <div v-if="currentShortUrl" class="short-link-card">
        <div class="short-link-label">短链接地址</div>
        <div class="short-link-value">
          <a :href="currentShortUrl" target="_blank">{{ currentShortUrl }}</a>
        </div>
      </div>
    </div>
    <div class="loading" :class="{ active: isLoading }">
      <div class="loading-spinner"></div>
      <span>正在生成短链接...</span>
    </div>
    <div class="action-buttons" v-if="currentShortUrl">
      <button class="action-btn" @click="copyLink">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
        </svg>
        {{ copyBtnText }}
      </button>
      <button class="action-btn share" :class="{ 'share-animation': shareAnimation, 'share-success': shareSuccess }" @click="shareLink">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
        <span class="share-btn-text">{{ shareBtnText }}</span>
      </button>
      <button class="action-btn qrcode" @click="generateQRCode">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-3v2h3v3h2v-3h3v-2h-3v-3h-2v3z" />
        </svg>
        生成二维码
      </button>
      <button class="action-btn stats" @click="showStats">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
        访问统计
      </button>
    </div>

    <!-- QR Code Modal -->
    <div class="modal" :style="{ display: qrcodeModalVisible ? 'flex' : 'none' }">
      <div class="modal-content">
        <div class="modal-close" @click="closeQRCodeModal">×</div>
        <h3>短链接二维码</h3>
        <div class="qrcode-container">
          <canvas ref="qrCanvas"></canvas>
        </div>
        <p>扫描二维码访问短链接</p>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { addUrl } from './services/api.js'

export default {
  name: 'App',
  data() {
    return {
      urlInput: '',
      currentShortUrl: '',
      isLoading: false,
      responseVisible: false,
      isError: false,
      qrcodeModalVisible: false,
      copyBtnText: '复制链接',
      shareBtnText: '分享链接',
      shareAnimation: false,
      shareSuccess: false
    }
  },
  methods: {
    // 验证URL格式是否正确
    validateUrl(url) {
      const urlPattern = /^(https?:\/\/|#小程序:\/\/).+/
      return urlPattern.test(url)
    },

    // 生成短链接
    async generateShortLink() {
      const inputUrl = this.urlInput.trim()
      if (!inputUrl) {
        this.showMessage('请输入链接', 'error')
        return
      }

      if (!this.validateUrl(inputUrl)) {
        this.showMessage('请输入有效的链接，必须以 http://、https:// 或 #小程序:// 开头', 'error')
        return
      }

      // 显示加载状态
      this.isLoading = true
      this.responseVisible = false

      try {
        // 使用 API 服务模块
        const data = await addUrl(inputUrl)

        // 隐藏加载状态
        this.isLoading = false

        // 设置当前短链接
        this.currentShortUrl = window.location.origin + data.url
        this.showMessage('短链接生成成功', 'success')
        this.urlInput = ''
        this.responseVisible = true
        this.isError = false
      } catch (error) {
        this.isLoading = false
        this.showMessage(`发生错误: ${error.message || '未知错误'}`, 'error')
        this.currentShortUrl = ''
        this.responseVisible = false
      }
    },

    // 复制链接
    async copyLink() {
      if (!this.currentShortUrl) {
        this.showMessage('没有可复制的短链接', 'error')
        return
      }

      try {
        await navigator.clipboard.writeText(this.currentShortUrl)
        this.showMessage('复制成功', 'success')
        this.copyBtnText = '已复制'
        setTimeout(() => {
          this.copyBtnText = '复制链接'
        }, 2000)
      } catch (error) {
        this.fallbackLegacyCopy(this.currentShortUrl)
      }
    },

    // 分享链接
    async shareLink() {
      if (!this.currentShortUrl) {
        this.showMessage('没有可分享的短链接', 'error')
        return
      }

      // 添加点击动画效果
      this.shareAnimation = true
      setTimeout(() => {
        this.shareAnimation = false
      }, 500)

      // 获取设备类型信息
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)

      // 准备分享内容
      const shareTitle = '短链接分享'
      const shareText = isMobile ?
        '我生成了一个短链接，点击访问：' :
        '我通过短链接服务生成了一个链接，点击访问：'

      // 检测是否支持Web Share API
      if (navigator.share) {
        try {
          this.shareBtnText = '分享中...'
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: this.currentShortUrl
          })

          // 分享成功
          this.shareSuccess = true
          this.showMessage('分享成功', 'success')
          this.shareBtnText = '已分享'
          
          // 恢复原始按钮状态
          setTimeout(() => {
            this.shareBtnText = '分享链接'
            this.shareSuccess = false
          }, 2000)
        } catch (error) {
          console.error('分享失败:', error)
          if (error.name === 'AbortError') {
            this.showMessage('分享已取消', 'info')
          } else {
            // 根据设备类型提供不同的提示
            if (isMobile) {
              if (isIOS) {
                this.showMessage('分享失败，请尝试使用Safari浏览器', 'info')
              } else if (isAndroid) {
                this.showMessage('分享失败，请尝试使用Chrome浏览器', 'info')
              } else {
                this.showMessage('分享失败，已复制链接到剪贴板', 'info')
              }
            } else {
              this.showMessage('分享失败，已复制链接到剪贴板', 'info')
            }
            // 如果分享API失败，回退到剪贴板复制
            this.fallbackToCopy(this.currentShortUrl)
          }
          // 恢复原始按钮状态
          this.shareBtnText = '分享链接'
        }
      } else {
        // 如果浏览器不支持原生分享API
        if (isMobile) {
          this.showMessage('您的浏览器不支持直接分享，已复制链接', 'info')
        } else {
          this.showMessage('PC端不支持直接分享，已复制链接到剪贴板', 'info')
        }
        // 复制到剪贴板
        this.fallbackToCopy(this.currentShortUrl)
      }
    },

    // 复制到剪贴板的回退方案
    async fallbackToCopy(url) {
      try {
        // 尝试使用现代Clipboard API
        await navigator.clipboard.writeText(url)
        this.showMessage('链接已复制到剪贴板，请手动分享', 'success')
      } catch (err) {
        console.error('Clipboard API失败，尝试备用方法:', err)
        // 如果Clipboard API失败，使用传统方法
        this.fallbackLegacyCopy(url)
      }
    },

    // 使用传统方法复制到剪贴板
    fallbackLegacyCopy(url) {
      try {
        // 创建一个临时输入框来复制
        const tempInput = document.createElement('input')
        tempInput.value = url
        tempInput.style.position = 'fixed'
        tempInput.style.opacity = '0'
        document.body.appendChild(tempInput)
        tempInput.focus()
        tempInput.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(tempInput)

        if (successful) {
          this.showMessage('链接已复制，请手动分享', 'success')
        } else {
          this.showMessage('复制失败，请手动复制链接', 'error')
        }
      } catch (err) {
        console.error('传统复制方法失败:', err)
        this.showMessage('无法复制链接，请手动复制', 'error')
      }
    },

    // 生成二维码
    generateQRCode() {
      if (!this.currentShortUrl) {
        this.showMessage('没有可生成二维码的短链接', 'error')
        return
      }

      this.qrcodeModalVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.qrCanvas, this.currentShortUrl, (error) => {
          if (error) {
            console.error('QR Code generation error:', error)
            this.showMessage('生成二维码失败', 'error')
          }
        })
      })
    },

    // 关闭二维码模态框
    closeQRCodeModal() {
      this.qrcodeModalVisible = false
    },

    // 显示统计信息
    showStats() {
      if (!this.currentShortUrl) {
        this.showMessage('没有可查看统计的短链接', 'error')
        return
      }
      this.showMessage('访问统计功能即将上线', 'info')
    },

    // 显示消息
    showMessage(message, type = '') {
      // 这里我们假设已经引入了 autolog.js
      // 如果在实际项目中，你可能需要使用 Vue 的消息组件或其他方式
      if (window.autolog) {
        window.autolog.log(message, type, 3000)
      } else {
        console.log(message)
        alert(message)
      }
    }
  },
  mounted() {
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) {
        this.qrcodeModalVisible = false
      }
    })
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'pingfang SC', 'helvetica neue', arial, 'hiragino sans gb', 'microsoft yahei ui', 'microsoft yahei', simsun, sans-serif;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
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
  background: linear-gradient(90deg, #4776E6, #8E54E9);
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

.github-link:hover {
  background: #6c5ce7;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(108, 92, 231, 0.2);
}

.github-link svg {
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
  background: linear-gradient(90deg, #4776E6, #8E54E9);
  border-radius: 2px;
}

.url-wrapper {
  margin-top: 24px;
  position: relative;
}

.input-container {
  position: relative;
  margin-bottom: 16px;
}

.input-container svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-90%);
  width: 20px;
  height: 20px;
  color: #a0a0a0;
}

input[type="text"] {
  width: 100%;
  padding: 14px 14px 14px 44px;
  margin-bottom: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

input[type="text"]:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.15);
  background-color: #fff;
}

input[type="button"] {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #4776E6, #8E54E9);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(108, 92, 231, 0.2);
}

input[type="button"]:hover {
  background: linear-gradient(90deg, #3d68d8, #7c48d5);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(108, 92, 231, 0.3);
}

input[type="button"]:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(108, 92, 231, 0.2);
}

.response {
  margin-top: 24px;
  font-size: 16px;
  color: #28a745;
  padding: 20px;
  border-radius: 12px;
  background-color: rgba(40, 167, 69, 0.05);
  border: 1px solid rgba(40, 167, 69, 0.2);
  display: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.response.error {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.05);
  border: 1px solid rgba(231, 76, 60, 0.2);
}

.short-link-card {
  margin-top: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.short-link-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.short-link-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.short-link-value {
  font-size: 16px;
  color: #6c5ce7;
  font-weight: 600;
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 8px;
}

.response.visible {
  display: block;
  animation: fadeIn 0.5s ease;
}

.response a {
  color: #6c5ce7;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.response a:hover {
  text-decoration: underline;
  color: #4834d4;
}

@media screen and (max-width: 520px) {
  body {
    padding: 16px;
    align-items: flex-start;
  }

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

.loading {
  display: none;
  margin-top: 16px;
  font-size: 14px;
  color: #6c5ce7;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 确保加载状态显示时是flex布局 */
.loading.active {
  display: flex;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(108, 92, 231, 0.3);
  border-radius: 50%;
  border-top-color: #6c5ce7;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 16px;
  background: #6c5ce7;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 8px rgba(108, 92, 231, 0.2);
}

.action-btn:hover {
  background: #4834d4;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(108, 92, 231, 0.3);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn.share {
  background: #00b894;
  box-shadow: 0 4px 8px rgba(0, 184, 148, 0.2);
}

.action-btn.share:hover {
  background: #00a382;
  box-shadow: 0 6px 12px rgba(0, 184, 148, 0.3);
}

.action-btn .share-btn-text {
  display: inline-block;
  transition: all 0.3s ease;
}

.action-btn.share-success {
  background: #00a382;
}

.share-animation {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.action-btn.qrcode {
  background: #0984e3;
  box-shadow: 0 4px 8px rgba(9, 132, 227, 0.2);
}

.action-btn.qrcode:hover {
  background: #0876cc;
  box-shadow: 0 6px 12px rgba(9, 132, 227, 0.3);
}

.action-btn.stats {
  background: #e17055;
  box-shadow: 0 4px 8px rgba(225, 112, 85, 0.2);
}

.action-btn.stats:hover {
  background: #d65f45;
  box-shadow: 0 6px 12px rgba(225, 112, 85, 0.3);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* QR Code Modal */
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

.qrcode-img {
  max-width: 200px;
  max-height: 200px;
}
</style>