import React, { useState, useEffect } from 'react';
import './App.css';
import { List, Avatar, Space, Dropdown, Button, Menu, message, Rate, Drawer } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, DownOutlined, FallOutlined } from '@ant-design/icons';
import contract from './contractAddress';
import ListOnLoading from './ListOnLoading';
import MoviePage from './MoviePage';
import BoxCard from './BoxCard';

const listData = [];

for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}


function RankingPage (props) {

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [seletedSorting, setSeletedSorting] = useState("Sorted By");
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();
  const [ratingSum, setRatingSum] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [aveRating, setAveRating] = useState(0);

  const sortByRating = (a, b) => b[1] - a[1];
  const sortByDate = (a, b) => b[0] - a[0];
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
    for (let i = 0; i < arr[0].length; i ++) {
      if (i > 0 & arr[0][i] === 0) {
        break;
      } else {
        let item = [arr[0][i], arr[2] === 0? 0: arr[1][i]/arr[2][i], arr[2][i]];
        list.push(item);
      }
    }
    console.log(`ziplist: ${list}`);
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
        console.log(`sorted by rating: ${list}`);
        setMovieList(list);
      }

    } catch(err) {
      setErrorMsg(err.stack)
    }
    setLoading(false);
  };

  // get movie info by index
  async function getMovieData(movieIndex) {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${contract}/get/${movieIndex}`);
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

  function onClickCard(index) {
    setSelectedMovie(index);
    setDrawerVisibility(true);
    getMovieData(index);
  }

  function onCloseDrawer(){
    setDrawerVisibility(false);
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
                <BoxCard key={item[0]} title={"title"} movieIndex={item[0]} movieRating={item[1]} onClick={()=>onClickCard(item.index)}/>
              </List.Item>
            )}
          />
          // <List
          //   itemLayout="vertical"
          //   size="large"
          //   pagination={{
          //     onChange: page => {
          //       console.log(page);
          //     },
          //     pageSize: 3,
          //   }}
          //   dataSource={movieList}

          //   renderItem={item => (
          //     <List.Item
          //       key={item[0]}
          //       actions={[
          //         <Rate allowHalf disable defaultValue={Math.round(item[1]*10)/10} />, <p>{Math.round(item[1]*10)/10}</p>,
          //         // <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
          //         // <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
          //         <IconText icon={MessageOutlined} text={item[2]} key="list-vertical-message" />,
          //       ]}
          //       extra={
          //         <div>
          //           <img
          //             width={272}
          //             alt="logo"
          //             src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          //           />
          //         </div>
          //       }
          //     >
          //       <List.Item.Meta
          //       avatar={<Avatar src={item.avatar} />}
          //       title={<a href={item.href}>{item.title}</a>}
          //       description={item.description}
          //       />
          //       {`index: ${item[0]}`}
          //       <BoxCard key={item.index} title={item.title} movieIndex={item.index} onClick={()=>onClickCard(item.index)}/>
          //     </List.Item>
          //   )}
          // />
        }
      </div>
      <Drawer
        title="Multi-level drawer"
        width={600}
        closable={false}
        onClose={onCloseDrawer}
        visible={drawerVisibility}
      >
        <MoviePage movieIndex={selectedMovie} aveRating={aveRating} ratingCount={ratingCount} ratingSum={ratingSum}/>
      </Drawer>
    </div>
  );
};

export default RankingPage;