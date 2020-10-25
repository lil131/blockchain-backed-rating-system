import React from 'react';
import { Skeleton, Card, Avatar, List } from 'antd';
// import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const { Meta } = Card;


function ListOnLoading() {

  return (
    <>
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
      dataSource={[1,1,1,1,1,1]}
      renderItem={(i) => (
        <List.Item>
          <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={true} avatar active>
              <Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title="Card title"
                description="This is the description"
              />
            </Skeleton>
          </Card>
        </List.Item>
      )}
    />
    
    </>
  );
}

export default ListOnLoading;