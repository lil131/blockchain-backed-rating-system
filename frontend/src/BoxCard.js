import React from 'react';
import './App.css';
import { Card, Rate } from 'antd';

const { Meta, Grid } = Card;

function BoxCard(props) {

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      // onClick={onClickCard}
      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
      <Meta title="Europe Street beat" description="www.instagram.com" />
      {/* <Rate allowHalf defaultValue={0} onChange={changeRating}/> */}
    </Card>
  );
}

export default BoxCard;
