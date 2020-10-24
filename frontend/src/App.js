import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Breadcrumb, BackTop, List } from 'antd';
import SearchBar from './SearchBar';
import HomePage from './HomePage';
import RankingPage from './RankingPage';

const { Header, Content, Footer } = Layout;



function App() {

  const [loading, setLoading] = useState(false);
  const [deployState, setDeployState] = useState("Deploy");
  const [contractAddress, setContractAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movieIndex, setMovieIndex] = useState();
  const [rating, setRating] = useState(0);
  const [ratingSum, setRatingSum] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [aveRating, setAveRating] = useState(0);
  
  const onSearch = value => console.log(value);

  async function deployContract() {
    setLoading(true);
    setErrorMsg(null);
    setDeployState("Deploying...")
    try {
      const res = await fetch('/api/contract', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const {contractAddress : addr, error} = await res.json();
      if (!res.ok) {
        setErrorMsg(error)
        setDeployState("Error! - Retry Deploy");
      } else {
        setContractAddress(addr);
        setDeployState("Redeploy");
      }
    } catch (err) {
      setErrorMsg(err.stack)
      setDeployState("Error! - Retry Deploy");
    }
    setLoading(false);
  }

  // rate movie
  async function setContractValue() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${contractAddress}/value`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movie_index: movieIndex,
          rating: rating
        })
      });
      const {error} = await res.json();
      if (!res.ok) {
        setErrorMsg(error)
      } else {
        getContractValue();
      }

    } catch(err) {
      setErrorMsg(err.stack)
    }
    setLoading(false);
  }

  // get movie
  async function getContractValue() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${contractAddress}/get/${movieIndex}`);
      const {ratingsum, ratingcount, error} = await res.json();
      console.log("client movieIndex: ", movieIndex);
      if (!res.ok) {
        setErrorMsg(error);
      } else {
        setAveRating(Math.round(ratingsum/ratingcount*10)/10);
        setRatingSum(ratingsum);
        setRatingCount(ratingcount);
        console.log(ratingsum, ratingcount);
      }
    } catch(err) {
      setErrorMsg(err.stack)
    }
    setLoading(false);
  }

  function onSelectMovie(event) {
    setMovieIndex(event.target.value);
  }
  function onRate(event){
    setRating(event.target.value);
  }


  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">Menu</Menu.Item>
            <Menu.Item key="2">Ranking</Menu.Item>
            <Menu.Item key="3">User</Menu.Item>
            <Menu.Item key="4">
            <SearchBar />
            </Menu.Item>
          </Menu>
        </Header>

        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">
            <HomePage />
            <RankingPage contract={contractAddress}/>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Kaleido Development Challenge ©2020 Created by LLL</Footer>
        <BackTop />
      </Layout>
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" aria-busy={loading}/>        
        <p>
          <button type="button" className="App-button" disabled={loading} onClick={deployContract}>{deployState} Contract</button>
        </p>
        { contractAddress && <p>
          Contract Address: {contractAddress}
        </p>}
        <p>
          <input className="App-input" disabled={loading || !contractAddress} onChange={onSelectMovie}/>
          <button type="button" className="App-button" disabled={loading || !contractAddress || !movieIndex} onClick={getContractValue}>Select Movie</button>
          <p>{`Ave Rating: ${aveRating}`}</p>
          <p>{`Rating Sum: ${ratingSum}`}</p>
          <p>{`Rating Count: ${ratingCount}`}</p>
        </p>
        <p>
          <input className="App-input" disabled={loading || !contractAddress} onChange={onRate}/>
          <button type="button" className="App-button" disabled={loading || !contractAddress} onClick={setContractValue}>Rate</button>
        </p>
        { errorMsg && <pre class="App-error">
          Error: {errorMsg}
        </pre>}
      </header>
      
    </div>
  );
}

export default App;
