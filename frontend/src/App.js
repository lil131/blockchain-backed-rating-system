import React from 'react';
import { Layout, BackTop } from 'antd';
import { RadarChartOutlined } from '@ant-design/icons';

import RankingPage from './RankingPage';

import './App.css';

const { Header, Content, Footer } = Layout;

function App() {

  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <RadarChartOutlined style={{ fontSize: '40px', color: '#ffffff' }} />
          <span style={{ color: 'white', fontSize: '15px' }}> Movie Rating System</span>
        </Header>

        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
          <RankingPage />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Kaleido Development Challenge ©2020 Created by LLL</Footer>
        <BackTop />
      </Layout>
    </div>
  );
}

export default App;
