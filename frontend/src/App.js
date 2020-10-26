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
          <div className="logo">
            <RadarChartOutlined style={{ fontSize: '36px' }} />
            <span style={{ fontSize: '16px', marginLeft:10 }}> Movie Rating System</span>
          </div>
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
