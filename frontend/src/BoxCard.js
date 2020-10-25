import React from 'react';
import { Card, Rate, Space } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import moviedata from './MovieData.json';
import './App.css';

const { Meta, Grid } = Card;

function BoxCard(props) {
  const movieInfo = moviedata[props.movieIndex];
  console.log(movieInfo);
  
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
      cover={<img alt="example" src={movieInfo.img} />}
    >
      <Meta title={movieInfo.title} description={movieInfo.description} />
      {/* <Rate allowHalf defaultValue={0} onChange={changeRating}/> */}
      <Rate allowHalf disable defaultValue={Math.round(props.movieRating*10)/10} />
      <b>{Math.round(props.movieRating*10)/10}</b>
      <p>
      <IconText icon={MessageOutlined} text={props.movieRating} key="list-vertical-message" />
      </p>
    </Card>
  );
}

export default BoxCard;
