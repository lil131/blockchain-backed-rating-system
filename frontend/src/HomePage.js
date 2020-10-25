import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, Rate, List, Button, Drawer } from 'antd';

import BoxCard from './BoxCard';
import MoviePage from './MoviePage';
import contractAddress from './contractAddress';
// import reqwest from 'reqwest';

const { Meta } = Card;

const ori_data = [
    {
      title: 'Title 1',
      index: 1,
    },
    {
      title: 'Title 2',
      index: 2,
    },
    {
      title: 'Title 3',
      index: 0,
    },
    {
      title: 'Title 4',
      index: 4,
    },
    {
      title: 'Title 5',
      index: 5,
    },
    {
      title: 'Title 6',
      index: 3,
    },
  ];


const count = 6;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}`;

function HomePage (props) {

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState(ori_data);
  const [list, setList] = useState([]);
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();
  const [ratingSum, setRatingSum] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [aveRating, setAveRating] = useState(0);



  // componentDidMount() {
  //   this.getData(res => {
  //     this.setState({
  //       loading: false,
  //       data: res.results,
  //       list: res.results,
  //     });
  //   });
  // }
  
  // useEffect(() => {
  //   getData(res => {
  //     setLoading(false);
  //     setData(res.results);
  //     setList(res.results);
  //   });
  // });

  async function getMoreData() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(fakeDataUrl);
      const {data, error} = await res.json();
      if (!res.ok) {
        setErrorMsg(error);
      } else {
        console.log(data)
        setData(data.results);
        setList(data.results);
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

  async function getMovieData(movieIndex) {
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

  // getData = callback => {
  //   reqwest({
  //     url: fakeDataUrl,
  //     type: 'json',
  //     method: 'get',
  //     contentType: 'application/json',
  //     success: res => {
  //       callback(res);
  //     },
  //   });
  // };

  // useEffect(()=>{window.dispatchEvent(new Event('resize'));});

  // const onLoadMore = () => {
  //   setLoading(true);
  //   setList(data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))))

  //   getData(res => {
  //     const cur_data = data.concat(res.results);
  //     setData(cur_data);
  //     setList(cur_data);
  //     setLoading(false);
      // useEffect(()=>{window.dispatchEvent(new Event('resize'));});

    //   this.setState(
    //     {
    //       data,
    //       list: data,
    //       loading: false,
    //     },
    //     () => {
    //       // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    //       // In real scene, you can using public method of react-virtualized:
    //       // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    //       window.dispatchEvent(new Event('resize'));
    //     },
    //   );
    // });
  // };s
    
  return (
    <div className="site-layout-content">
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
        dataSource={data}
        renderItem={(item, i) => (
          <List.Item>
            <BoxCard key={i} title={item.title} movieIndex={item.index} onClick={()=>onClickCard(item.index)}/>
          </List.Item>
        )}
      />

      <Drawer
        title="Multi-level drawer"
        width={600}
        closable={false}
        onClose={this.onCloseDrawer}
        visible={drawerVisibility}
      >
        <MoviePage movieIndex={selectedMovie}/>
      </Drawer>

      {/* <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
      >
        <Meta title="Europe Street beat" description="www.instagram.com" />
        <Rate allowHalf defaultValue={0} />
      </Card> */}
      {/* <Button onClick={onLoadMore}>Loading More</Button> */}
    </div>
  );
};

export default HomePage;