import React, { useState, useEffect } from 'react';
import { message, Rate, Statistic, Row, Col, Carousel, Descriptions } from 'antd';
import { StarTwoTone, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

import './MoviePage.css'

const userIndex = 4;

function MoviePage(props) {
  const movie = props.movie;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    getRatings();
  }, [])

  function onRatingChange(v) {
    setRating(v);
    updateRating(v);
  };

  // get movie rating info
  async function getRatings() {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.get(`/api/movies/${movie.id}`);
      const {ratingsum, ratingcount} = res.data;

      movie.rating = Math.round(ratingsum / ratingcount * 10) / 10;
      movie.count = ratingcount;
      props.updateMovie(movie);
    } catch(err) {
      setErrorMsg(err.stack)
    }

    setLoading(false);
  }

  // rate movie
  async function updateRating(rating) {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.post(`/api/movie/${movie.id}`, {
        rating: rating
      });

      getRatings();
      message.success('Rated Successfully!');
    } catch(err) {
      setErrorMsg(err.stack);
      message.error('Error! Please try again.');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="carousel">
        <Row>
            {
              [0, 2, 4, 6].map(i => (
                <Col key={i} xs={12} md={6}>
                  <Carousel autoplay dots={false}>
                    {movie.photos.slice(i, i + 2).map((e, j) => (<img key={j} src={movie.photos[i+j]} />))}
                  </Carousel>
                </Col>
              ))
            }
        </Row>
      </div>
      <div className="rating-stat">
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Rate" value={movie.rating} prefix={<StarTwoTone />} />
        </Col>
        <Col span={12}>
          <Statistic title="Rated" value={movie.count} prefix={<TeamOutlined />}/>
        </Col>
      </Row>
      </div>
      <div className="rating-div" >
        <Rate allowHalf defaultValue={rating} onChange={onRatingChange} allowClear={true}/>{rating}
      </div>
      <div className="description">
        <Descriptions
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Year">{movie.year}</Descriptions.Item>
          <Descriptions.Item label="Length">{movie.length}</Descriptions.Item>
          <Descriptions.Item label="Category">{movie.category}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {movie.desc}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
}

export default MoviePage;