import React, { useState, useEffect } from 'react';
import { List, Avatar, Space, Dropdown, Button, Menu, message, Rate, Drawer } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, DownOutlined, FallOutlined } from '@ant-design/icons';

import ListOnLoading from './ListOnLoading';
import MoviePage from './MoviePage';
import BoxCard from './BoxCard';

import contract from './contractAddress';
import moviedata from './MovieData.json';
import './App.css';

const sortMethods = [
  {name: 'Rating', fun: (a, b) => b.rating - a.rating},
  {name: 'Popularity', fun: (a, b) => b.count - a.count},
  {name: 'Date', fun: (a, b) => b.year - a.year}
]

function RankingPage (props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movieList, setMovieList] = useState([]); // list for sorting
  const [seletedSorting, setSeletedSorting] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // get movies when component mounted 
  useEffect(() => {
    if (movieList.length === 0) {
      console.log('geting list');
      getMovieList();
    }
  }, []);


  function handleMenuClick(e) {
    setSeletedSorting(e.key);
    movieList.sort(sortMethods[e.key].fun)
    setMovieList([...movieList])
  }

  // get movie list
  async function getMovieList() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${contract}/getlist`);
      const {raw: movieMeta, error} = await res.json();

      if (!res.ok) {
        setErrorMsg(error);
      } else {
        const list = Object.keys(moviedata).map(k => moviedata[k]);
        const totalRatings = movieMeta[1];
        const counts = movieMeta[2];
        totalRatings.forEach((r, i) => {
          if (i < list.length) {
            list[i].rating = counts[i] === 0 ? 0 : Math.round(r / counts[i] * 10) / 10;
          }
        });
        counts.forEach((c, i) => {
          if (i < list.length) {
            list[i].count = c;
          }
        });
        list.sort(sortMethods[seletedSorting].fun);
        setMovieList(list);
    console.log(list)

      }

    } catch(err) {
      setErrorMsg(err.stack)
    }
    setLoading(false);
  };

  // drawer
  function onClickCard(item) {
    setSelectedMovie(item);
  }

  // close and reset selectedMovie
  function onCloseDrawer(){
    setSelectedMovie(null);
  };

  function updateMovie(movie) {
    const newList = movieList.map((m, i) => m.index === movie.index ? movie : m);
    setMovieList(newList);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={0} icon={<FallOutlined />}>
        rating
      </Menu.Item>
      <Menu.Item key={1} icon={<FallOutlined />}>
        polularity
      </Menu.Item>
      <Menu.Item key={2} icon={<FallOutlined />}>
        publish date
      </Menu.Item>
    </Menu>
  );

  return(
    <div className="movie-list-content">
      <div className="ranking-layout-content">
        <Dropdown overlay={menu}>
          <Button>
            Sort by {sortMethods[seletedSorting].name} <DownOutlined />
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
            renderItem={item => (
              <List.Item>
                <div key={item.index} onClick={() => onClickCard(item)}>
                  <BoxCard 
                    key={item.index}
                    movie={item}
                  />
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
        visible={selectedMovie === null ? false : true}
      >
        {selectedMovie !== null && <MoviePage movie={selectedMovie} updateMovie={updateMovie} />}
      </Drawer>
    </div>
  );
};

export default RankingPage;