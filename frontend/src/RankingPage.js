import React, { useState, useEffect } from 'react';
import { List, Avatar, Space, Dropdown, Button, Menu, message, Rate, Drawer } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, DownOutlined, FallOutlined } from '@ant-design/icons';

import ListOnLoading from './ListOnLoading';
import MoviePage from './MoviePage';
import BoxCard from './BoxCard';
import contract from './contractAddress';

import './App.css';


function RankingPage (props) {

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [movies, setMovies] = useState([]);
  const [seletedSorting, setSeletedSorting] = useState("Sorted By");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();
  const [aveRating, setAveRating] = useState();
  const [ratingCount, setRatingCount] = useState();


  const sortByRating = (a, b) => b[1] - a[1];
  const sortByDate = (a, b) => b[0] - a[0];
  const sortByIndex = (a, b) => b[0] - a[0];
  const sortByPopularity = (a, b) => b[2] - a[2];

  // get movies when component mounted 
  useEffect(()=>{
    if (movieList.length === 0) {
      console.log('geting list');
      getMovieList();
    }
  }, []);

  function handleMenuClick(e) {
    // message.info('Click on menu item.');
    console.log("key: ", e.key);
    let list = movieList;
    console.log(list);
    if (e.key === "1") {
      list.sort(sortByRating);
      setMovieList(list);
      setSeletedSorting("By Rating");
    } if (e.key === "2") {
      list.sort(sortByPopularity);
      console.log('pop', list)
      setMovieList(list);
      setSeletedSorting("By Popularity");
      console.log('state:', list);
    } if (e.key === "3") {
      list.sort(sortByDate);
      setMovieList(list);
      setSeletedSorting("By Date");
    }
  }

  // zip data
  const zip = (arr) => {
    let list = [];
    let copy = [];
    for (let i = 0; i < arr[0].length; i ++) {
      if (i > 0 & arr[0][i] === 0) {
        break;
      } else {
        let item = [arr[0][i], arr[2] === 0? 0: arr[1][i]/arr[2][i], arr[2][i]]; // [index, aveRating, count]
        list.push(item);
        copy.push(Array(...item));
      }
    }
    setMovies(copy);
    console.log("ori.movies after:");
    console.log(copy);
    return list;
  };

  // get movie list
  async function getMovieList() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${contract}/getlist`);
      const {raw, error} = await res.json();

      if (!res.ok) {
        setErrorMsg(error);
      } else {
        var list = zip(raw);
        list.sort(sortByRating);
        setMovieList(list);
      }

    } catch(err) {
      setErrorMsg(err.stack)
    }
    setLoading(false);
  };

  // drawer
  function onClickCard(index) {
    setSelectedMovie(index);
    setAveRating(movies[index][1]);
    setRatingCount(movies[index][2]);
    setDrawerVisible(true);
  }

  // close and reset selectedMovie
  function onCloseDrawer(){
    setDrawerVisible(false);
    setSelectedMovie();
    setAveRating();
    setRatingCount();
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<FallOutlined />}>
        rating
      </Menu.Item>
      <Menu.Item key="2" icon={<FallOutlined />}>
        polularity
      </Menu.Item>
      <Menu.Item key="3" icon={<FallOutlined />}>
        publish date
      </Menu.Item>
    </Menu>
  );

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
    );

  return(
    <div className="movie-list-content">
      <div className="ranking-layout-content">
        <button type="button" className="App-button" onClick={getMovieList}>get all</button>
        <Dropdown overlay={menu}>
          <Button>
            {seletedSorting || "Sorted by"} <DownOutlined />
          </Button>
        </Dropdown>
        {loading ? <ListOnLoading/> :
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
            }}
            dataSource={movieList}
            renderItem={(item, i) => (
              <List.Item>
                <div key={item[0]} onClick={()=>onClickCard(item[0])}>
                  <BoxCard key={item[0]} title={"title"} movieIndex={item[0]} movieRating={item[1]} />
                </div>
              </List.Item>
            )}
          />
        }
      </div>
      <Drawer
        title="Title"
        width={600}
        placement="right"
        closable={false}
        onClose={onCloseDrawer}
        visible={drawerVisible}
      >
        {selectedMovie === undefined ? <div/> :
        <MoviePage movieIndex={selectedMovie} aveRating={aveRating} ratingCount={ratingCount} />
        }
      </Drawer>
    </div>
  );
};

export default RankingPage;