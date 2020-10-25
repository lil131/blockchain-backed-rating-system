import React, { useState } from 'react';
import { Layout, Menu, BackTop } from 'antd';

import RankingPage from './RankingPage';

import './App.css';

const { Header, Content, Footer } = Layout;

function App() {

  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" >
            <Menu.Item key="1">Logo</Menu.Item>
          </Menu>
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
