
import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import App from './App';

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConfigProvider>,
  document.getElementById('root')
);
