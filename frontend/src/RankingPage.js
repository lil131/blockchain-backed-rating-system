import React, { useState } from 'react';
import './App.css';
import { List, Avatar, Space, Dropdown, Button, Menu, message, Rate } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, DownOutlined, FallOutlined } from '@ant-design/icons';

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

  const sortByRating = (a, b) => b[1] - a[1];
  const sortByDate = (a, b) => b[0] - a[0];
  const sortByPopularity = (a, b) => b[2] - a[2];

  function handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log("key: ", e.key);
    let list = movieList;
    console.log(list);
    if (e.key == "1") {
      list.sort(sortByRating);
      setMovieList(list);
    } if (e.key == "2") {
      list.sort(sortByPopularity);
      console.log('pop', list)
      setMovieList(list);
      console.log('state:', list);
    } else {
      list.sort(sortByDate);
      setMovieList(list);
    }
  }

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
    );

  // get movie list
  const zip = (arr) => {
    let list = [];
    for (let i = 0; i < arr[0].length; i ++) {
      if (i > 0 & arr[0][i] == 0) {
        break;
      } else {
        let item = [arr[0][i], arr[2] == 0? 0: arr[1][i]/arr[2][i], arr[2][i]];
        list.push(item);
      }
    }
    console.log(`ziplist: ${list}`);
    return list;
  };

  async function getMovieList() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${props.contract}/getlist`);
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

  return(
    <div className="ranking-layout-content">
      <button type="button" className="App-button" onClick={getMovieList}>get all</button>
      <Dropdown overlay={menu}>
        <Button>
          Sorted by <DownOutlined />
        </Button>
      </Dropdown>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={movieList}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={item => (
          <List.Item
            key={item[0]}
            actions={[
              <Rate allowHalf defaultValue={Math.round(item[1])} />, <p>{item[1]}</p>,
              // <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              // <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text={item[2]} key="list-vertical-message" />,
            ]}
            extra={
              <div>
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
                <p>index: {item[0]}</p>
              </div>
            }
          >
            <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={<a href={item.href}>{item.title}</a>}
            description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    </div>
  );
};

export default RankingPage;