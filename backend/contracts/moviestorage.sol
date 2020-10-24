pragma solidity >=0.4.24 <0.6.0;

contract moviestorage {

  struct Movie {
    uint movie_index;
    uint rating_sum;
    uint rating_count;
    uint cur_rating;
    // uint[] rated_users; // user index
    // uint[] user_ratings;
    // mapping (string => uint) voted;
  }
  
  uint public movieCount;
  string[] users;
  mapping (uint => Movie) public movies;

  constructor () public {
    // addMovie(10, 5, [1,2,3,4,5], [1,2,3,2,2]);
    // addMovie(15, 3, [2,1,5], [5,5,5]);
    // addMovie(1,1,[3],[1]);

    addMovie(10, 5);
    addMovie(15, 3);
    addMovie(1, 1);
  }


   function addMovie (uint sum, uint count) private {
    movies[movieCount++] = Movie(movieCount, sum, count, sum/count);
  }
//   function addMovie (uint ratingSum, uint ratingCount, uint[] memory ratedUser, uint[] memory userRatings) private {
//     movies[movieCount++] = Movie(movieCount, ratingSum, ratingCount, ratingSum/ratingCount, ratedUser, userRatings);
//   }

//   function getMovie(uint movie_index) public view 
//   returns (uint[] memory ratingsum, uint ratingcount, uint rating, uint[] memory ratedusers, uint[] memory ratings) {
//     Movie memory m = movies[movie_index];
//     ratingcount = m.rating_count;
//     rating = m.cur_rating;
//     ratedusers = m.rated_users;
//     ratings = m.user_ratings;
//     return (ratingsum, ratingcount, rating, ratedusers, ratings);
//   }

  function getMovie(uint movie_index) public view 
  returns (uint ratingsum, uint ratingcount, uint rating) {
    Movie memory m = movies[movie_index];
    ratingcount = m.rating_count;
    ratingsum = m.rating_sum;
    rating = m.cur_rating;
    return (ratingsum, ratingcount, rating);
  }
  
   function rateMovie(uint rating, uint movie_index) public {
    movies[movie_index].rating_count += 1;
    movies[movie_index].rating_sum += rating;
    movies[movie_index].cur_rating = movies[movie_index].rating_sum / movies[movie_index].rating_count;
  }

//   function rateMovie(uint user_index, uint rating, uint movie_index) public {
//     Movie storage m = movies[movie_index];
//     m.user_ratings.push(rating);
//     m.rated_users.push(user_index);
//     m.rating_count += 1;
//     m.rating_sum += rating;
//     m.cur_rating = m.rating_sum / m.rating_count;
//   }

//   function rateMovie(uint user_index, uint rating, uint movie_index) public 
//   returns (uint new_rating) 
//   {
//     Movie storage m = movies[movie_index];
//     m.user_ratings.push(rating);
//     m.rated_users.push(user_index);
//     m.rating_count += 1;
//     m.rating_sum += rating;
//     m.cur_rating = m.rating_sum / m.rating_count;

//     new_rating = m.cur_rating;
//   }

}

// function AveRate(uint total_rating, uint count_ratings) public view returns (uint movie_rating) {
//     return total_rating / count_ratings;
// }