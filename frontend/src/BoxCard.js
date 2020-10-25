import React from 'react';
import { Card, Rate, Space } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import './App.css';

const { Meta, Grid } = Card;

function BoxCard(props) {
  const movie = props.movie;  
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
    );

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      // onClick={onClickCard}
      cover={<img alt="example" src={movie.img} />}
    >
      <Meta title={movie.title} description={movie.year} />
      {/* <Rate allowHalf defaultValue={0} onChange={changeRating}/> */}
      <Rate allowHalf disabled value={movie.rating} />
      <b>{movie.rating}</b>
      <p>{movie.index}</p>
      {/* <IconText icon={MessageOutlined} text={props.movieRating} key="list-vertical-message" /> */}
    </Card>
  );
}

export default BoxCard;
