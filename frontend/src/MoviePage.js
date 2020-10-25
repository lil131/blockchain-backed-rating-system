import React, { useState, useEffect } from 'react';
import './App.css';
import { message, Card, Rate, List, Button } from 'antd';
import './MoviePage.css'
import contract from './contractAddress';

const movieIndex = 1; 

function MoviePage(props) {
  const movieIndex = props.movieIndex;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingSum, setRatingSum] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [aveRating, setAveRating] = useState(0);


  function onChangeRating(v) {
    console.log('rating: ', v);
    setRating(v);
    updateRating(v);
  };

  // get movie rating info
  async function getRatings() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${contract}/get/${movieIndex}`);
      const {ratingsum, ratingcount, error} = await res.json();
      console.log("client movieIndex: ", movieIndex);
      if (!res.ok) {
        setErrorMsg(error);
      } else {
        setAveRating(Math.round(ratingsum/ratingcount*10)/10);
        setRatingSum(ratingsum);
        setRatingCount(ratingcount);
        console.log(ratingsum, ratingcount);
      }
    } catch(err) {
      setErrorMsg(err.stack)
    }

    setLoading(false);
  }

  // rate movie
  async function updateRating(rating) {
    console.log(rating);
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/contract/${contract}/value`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movie_index: movieIndex,
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
      setErrorMsg(err.stack)
      message.error('Error! Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="site-layout-background" style={{ padding: 44, minHeight: 380 }}>
      <div className="media">
      <img></img>
        <div className="rating-div" >
          <Rate allowHalf defaultValue={rating} onChange={(v)=>onChangeRating(v)} allowClear={true}/>
          <p>{`Ave Rating: ${aveRating}`}</p>
          <p>{`Rating Sum: ${ratingSum}`}</p>
          <p>{`Rating Count: ${ratingCount}`}</p>
        </div>
        <p>description</p>
      </div>
      Movie: {movieIndex}
    </div>
  );
}
export default MoviePage;