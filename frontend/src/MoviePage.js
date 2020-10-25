import React, { useState, useEffect } from 'react';
import { message, Rate } from 'antd';
import { StarTwoTone } from '@ant-design/icons';

import contract from './contractAddress';
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
      const res = await fetch(`/api/movies/${movie.index}`);
      const {ratingsum, ratingcount, error} = await res.json();
      console.log(ratingsum, ratingcount, error)
      if (!res.ok) {
        setErrorMsg(error);
      } else {
        movie.rating = Math.round(ratingsum / ratingcount * 10) / 10;
        movie.count = ratingcount;
        props.updateMovie(movie);
        console.log(movie);
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
      const res = await fetch(`/api/movie`, {
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
        getRatings();
        message.success('Rated Successfully!');
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
      <img alt="example" src={movie.img} />
      <StarTwoTone /><b>{movie.rating}</b>
        <div className="rating-div" >
          <Rate allowHalf defaultValue={rating} onChange={onRatingChange} allowClear={true}/>
          <p>{`Ave Rating: ${movie.rating}`}</p>
          <p>{`Rating Count: ${movie.count}`}</p>
        </div>
        <p>description: {movie.description}</p>
      </div>
      Movie: {movie.title}
    </div>
  );
}

export default MoviePage;