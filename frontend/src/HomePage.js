import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, Rate, List, Button } from 'antd';
import BoxCard from './BoxCard';
// import reqwest from 'reqwest';

const { Meta } = Card;

const ori_data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
    {
      title: 'Title 5',
    },
    {
      title: 'Title 6',
    },
  ];


const count = 6;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}`;

function HomePage () {

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState(ori_data);
  const [list, setList] = useState([]);


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

  async function getData() {
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
          md: 4,
          lg: 4,
          xl: 5,
          xxl: 6,
        }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <BoxCard />
          </List.Item>
        )}
      />
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
      >
        <Meta title="Europe Street beat" description="www.instagram.com" />
        <Rate allowHalf defaultValue={0} />
      </Card>
      {/* <Button onClick={onLoadMore}>Loading More</Button> */}
    </div>
  );
};

export default HomePage;