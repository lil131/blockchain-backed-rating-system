import React from 'react';
import { Card, Rate } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const { Meta } = Card;

function BoxCard(props) {
  const movie = props.movie;  

  return (
    <Card
      hoverable
      style={{ width: '100%', maxWidth: 320 }}
      cover={props.loading ? undefined : <img alt="example" src={movie.img} />}
      loading={props.loading}
    >
      <Meta title={movie.title} description={movie.year} />
      <Rate allowHalf disabled value={movie.rating} /><span>  {movie.rating}</span>
      <p><TeamOutlined /> {movie.count}</p>
    </Card>
  );
}

export default React.memo(BoxCard);
