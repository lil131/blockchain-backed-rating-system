import React from 'react';
import { Card, Rate, Space } from 'antd';

import './App.css';

const { Meta } = Card;

function BoxCard(props) {
  const movie = props.movie;  

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      // onClick={onClickCard}
      cover={<img alt="example" src={movie.img} />}
    >
      <Meta title={movie.title} description={movie.year} />
      <Rate allowHalf disabled value={movie.rating} />
      <b>{movie.rating}</b>
      <p>{movie.index}</p>
    </Card>
  );
}

export default BoxCard;
