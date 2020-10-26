import React from 'react';
import { Skeleton, Card, Avatar, List } from 'antd';
// import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const { Meta } = Card;


function ListOnLoading() {
  const data = [];
  for (let i = 1; i <= 20; i ++) {
    data.push(i)
  }

  return (
    <List
      grid={{
        gutter: [16, 20],
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
        xxl: 5,
      }}
      dataSource={data}
      renderItem={(i) => (
        <List.Item>
          <Card >
            <Skeleton.Image active />
            <Skeleton loading={true} avatar active />
          </Card>
        </List.Item>
      )}
    />
  );
}

export default ListOnLoading;