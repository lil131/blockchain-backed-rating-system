import React, { useState, useEffect } from 'react';
import { message, Card, Rate, List, Button } from 'antd';
import { StarTwoTone } from '@ant-design/icons';

import contract from './contractAddress';
import './MoviePage.css'

function MoviePage(props) {
  const movie = props.movie;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rating, setRating] = useState(0);

  function onRatingChange(v) {
    setRating(v);
    updateRating(v);
  };

  // get movie rating info
  async function getRatings() {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/contract/${contract}/get/${movie.index}`);
      const {ratingsum, ratingcount, error} = await res.json();

      if (!res.ok) {
        setErrorMsg(error);
      } else {
        movie.rating = Math.round(ratingsum / ratingcount * 10) / 10;
        movie.count = ratingcount;
        props.updateMovie(movie);
      }
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
      const res = await fetch(`/api/contract/${contract}/value`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movie_index: movie.index,
          rating: rating
        })
      });
      const {error} = await res.json();
      if (!res.ok) {
        setErrorMsg(error)
        message.error('Error! Please try again.');
      } else {
        message.success('Rated Successfully!');
        getRatings();
      }

    } catch(err) {
      setErrorMsg(err.stack);
      message.error('Error! Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="site-layout-background" style={{ padding: 44, minHeight: 380 }}>
      <div className="media">
      <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
      <StarTwoTone /><b>{movie.rating}</b>
        <div className="rating-div" >
          <Rate allowHalf defaultValue={rating} onChange={onRatingChange} allowClear={true}/>
          <p>{`Ave Rating: ${movie.rating}`}</p>
          <p>{`Rating Count: ${movie.count}`}</p>
        </div>
        <p>description</p>
      </div>
      Movie: {movie.title}
    </div>
  );
}

export default MoviePage;