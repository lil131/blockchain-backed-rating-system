import React, { useState } from 'react';
import { message, Rate, Statistic, Row, Col, Carousel, Button, Image, Spin, Space } from 'antd';
import { StarTwoTone, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

import './MoviePage.css'

function MoviePage(props) {
  const movie = props.movie;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rating, setRating] = useState(null);

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
      const {averating, ratingcount} = res.data;
      movie.rating = averating;
      movie.count = ratingcount;
      props.updateMovie({...movie});
    } catch(err) {
      setErrorMsg(err.stack);
      message.error(errorMsg);
    }

    setLoading(false);
  }

  // rate movie
  async function updateRating(rating) {
    setLoading(true);
    setErrorMsg(null);

    try {
      await axios.post(`/api/movie/${movie.id}`, {
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
      <div className="poster">
        <Image src={movie.img} />
        <div style={{margin: 10}}>
          <Space>
            Your Rating: 
            <Rate 
              allowHalf 
              disabled={rating !== null} 
              defaultValue={rating === null ? 0 : rating} 
              onChange={onRatingChange} 
              allowClear={true}
            />
            {rating === null ? 0 : rating}
            {loading && <Spin />}
          </Space>
        </div>
      </div>

      <Row gutter={16} className="rating-stat">
        <Col span={12}>
          <Statistic title="Average Rating" value={movie.rating === null ? 0 : movie.rating} prefix={<StarTwoTone />} />
        </Col>
        <Col span={12}>
          <Statistic title="Rating Count" value={movie.count} prefix={<TeamOutlined />}/>
        </Col>
      </Row>

      <div className="description">{movie.desc}</div>
      <div className="details"><b>Length: </b>{movie.length}</div>
      <div className="details"><b>Year: </b>{movie.year}</div>
      <div className="details"><b>Directors: </b>{movie.directors.join(', ')}</div>
      <div className="details"><b>Actors: </b>{movie.stars.join(', ')}</div>
      <div className="details"><b>Category: </b>{movie.category}</div>
      <Button ghost className="imdb" type="primary" href={movie.imdbUrl} target="_blank"><b>IMDb</b></Button>

      <div className="carousel">
        <Row>
            {
              [0, 2, 4, 6].map(i => (
                <Col key={i} xs={12} md={6}>
                  <Carousel autoplay dots={false}>
                    {movie.photos.slice(i, i + 2).map((e, j) => (<img key={j} alt={`movie-${i + j}`} src={movie.photos[i+j]} />))}
                  </Carousel>
                </Col>
              ))
            }
        </Row>
      </div>
    </div>
  );
}

export default MoviePage;