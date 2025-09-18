<template>
  <div class="history-container">
    <div class="wrapper">
      <header>歷史紀錄</header>
      <p class="subtitle">您在此裝置上產生的所有短連結紀錄。</p>

      <div v-if="history.length === 0" class="no-records">
        <p>目前沒有任何紀錄。</p>
        <router-link to="/" class="back-home-btn">返回首頁</router-link>
      </div>

      <div v-else class="history-table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>原始連結</th>
              <th>短連結</th>
              <th>產生時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in history" :key="index">
              <td class="original-link" :title="item.originalUrl">{{ item.originalUrl }}</td>
              <td>
                <a :href="item.shortUrl" target="_blank">{{ item.shortUrl }}</a>
              </td>
              <td>{{ item.createdAt }}</td>
              <td>
                <button class="action-btn-small" @click="copyLink(item.shortUrl)">複製</button>
                <button class="action-btn-small stats" @click="fetchStats(item.shortUrl)">查看點擊</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="actions-footer">
            <button @click="clearHistory" class="clear-btn">清除所有紀錄</button>
            <router-link to="/" class="back-home-btn">返回首頁</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getStats } from '@/services/api.js';
import { showMessage } from '@/utils/message.js';

const history = ref([]);

onMounted(() => {
  const storedHistory = localStorage.getItem('shortLinkHistory');
  if (storedHistory) {
    history.value = JSON.parse(storedHistory);
  }
});

async function copyLink(url) {
  try {
    await navigator.clipboard.writeText(url);
    showMessage('複製成功', 'success');
  } catch (error) {
    showMessage('複製失敗', 'error');
  }
}

async function fetchStats(shortUrl) {
    if (!shortUrl) return;
    try {
        const hash = shortUrl.split('/').pop();
        const response = await getStats(hash);
        const clicks = response.data.clicks;
        showMessage(`此連結已被點擊 ${clicks} 次`, 'info');
    } catch (error) {
        showMessage(error.message || '無法取得統計資料', 'error');
    }
}


function clearHistory() {
  if (confirm('您確定要清除所有歷史紀錄嗎？此操作無法復原。')) {
    localStorage.removeItem('shortLinkHistory');
    history.value = [];
    showMessage('歷史紀錄已清除', 'success');
  }
}
</script>

<style scoped>
.history-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
}
.wrapper {
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 900px;
  text-align: center;
}
header {
  font-size: 36px;
  margin-bottom: 10px;
  color: #2d3436;
  font-weight: 700;
}
.subtitle {
  font-size: 16px;
  color: #636e72;
  margin-bottom: 30px;
}
.no-records {
  margin-top: 40px;
}
.history-table-container {
  overflow-x: auto;
}
.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.history-table th, .history-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.history-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}
.original-link {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-table a {
  color: #6c5ce7;
  text-decoration: none;
}
.history-table a:hover {
  text-decoration: underline;
}
.actions-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}
.action-btn-small {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #6c5ce7;
  background-color: transparent;
  color: #6c5ce7;
  transition: all 0.2s ease;
}
.action-btn-small:hover {
  background-color: #6c5ce7;
  color: #fff;
}
.action-btn-small.stats {
    border-color: #e17055;
    color: #e17055;
    margin-left: 8px;
}
.action-btn-small.stats:hover {
    background-color: #e17055;
    color: #fff;
}
.clear-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #e74c3c;
    color: #e74c3c;
    background-color: transparent;
    cursor: pointer;
}
.clear-btn:hover {
    background-color: #e74c3c;
    color: #fff;
}
.back-home-btn {
  padding: 8px 16px;
  border-radius: 8px;
  background: #6c5ce7;
  color: #fff;
  text-decoration: none;
}
</style>