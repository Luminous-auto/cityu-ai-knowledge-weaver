import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// 配置 Ant Design 的全局设置
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConfigProvider 
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontSize: 14,
        },
        components: {
          Button: {
            borderRadius: 6,
            controlHeight: 36,
          },
          Input: {
            borderRadius: 6,
          },
          Card: {
            borderRadius: 8,
          },
          Select: {
            borderRadius: 6,
          },
          Alert: {
            borderRadius: 6,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

// 性能监控
if (process.env.NODE_ENV === 'development') {
  import('web-vitals').then((webVitals) => {
    if (webVitals.getCLS) {
      webVitals.getCLS(console.log);
      webVitals.getFID(console.log);
      webVitals.getFCP(console.log);
      webVitals.getLCP(console.log);
      webVitals.getTTFB(console.log);
    }
  }).catch(error => {
    console.log('Web Vitals 加载失败:', error);
  });
}