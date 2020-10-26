import React from 'react';
import { Card, Rate } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

import './App.css';

const { Meta } = Card;

function BoxCard(props) {
  const movie = props.movie;  

  return (
    <Card
      hoverable
      style={{ maxWidth: 320 }}
      // onClick={onClickCard}
      cover={<img alt="example" src={movie.img} />}
    >
      <Meta title={movie.title} description={movie.year} />
      <Rate allowHalf disabled value={movie.rating} /><span>  {movie.rating}</span>
      <p><TeamOutlined /> {movie.count}</p>
    </Card>
  );
}

export default BoxCard;
