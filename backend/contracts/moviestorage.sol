pragma solidity >=0.4.24 <0.6.0;

contract moviestorage {

  struct Movie {
    uint movie_index;
    uint rating_sum;
    uint rating_count;
    // uint256[100] rated_users; // user index
    // uint256[100] user_ratings;
  }
  
  uint public movieCount;
  mapping (uint => Movie) public movies;
  string[] users;
  uint public test;

  constructor () public {
    // addMovie(10, 2, [2,3], [5,5]);
    // addMovie(12, 3, [2,1,5], [5,4,3]);
    // addMovie(1,1,[3],[1]);

    addMovie(10, 2);
    // rateMovie(0, 2, 5);
    // rateMovie(0, 3, 5);

    addMovie(12, 3);
    // rateMovie(1, 2, 5);
    // rateMovie(1, 1, 4);
    // rateMovie(1, 5, 3);

    addMovie(1, 1);
    // rateMovie(2, 3, 1);
  }


   function addMovie (uint sum, uint count) private {
    movies[movieCount].movie_index = movieCount;
    movies[movieCount].rating_sum = sum;
    movies[movieCount].rating_count = count;
    movieCount++;
  }

  function getMovie(uint movie_index) public view 
  returns (uint ratingsum, uint ratingcount) {
    Movie memory m = movies[movie_index];
    ratingcount = m.rating_count;
    ratingsum = m.rating_sum;
    // ratedusers = m.rated_users;
    // userratings = m.user_ratings;
    return (ratingsum, ratingcount);
  }
  
  function rateMovie(uint movie_index, uint rating) public
  returns (uint ratingsum, uint ratingcount) {
    movies[movie_index].rating_count += 1;
    movies[movie_index].rating_sum += rating;

    ratingsum = movies[movie_index].rating_sum;
    ratingcount = movies[movie_index].rating_count;
    return (ratingsum, ratingcount);

    // movies[movie_index].rated_users[ratingcount - 1] = user_index;
    // movies[movie_index].user_ratings[ratingcount - 1] = rating;
    
    // ratedusers = movies[movie_index].rated_users;
    // userratings = movies[movie_index].user_ratings;
  }

  function getMovieList() public view 
  returns (uint256[30] memory movieindices, uint256[30] memory ratingsums, uint256[30] memory ratingcounts)
  {
    for (uint i = 0; i < movieCount; i++ ) {
        movieindices[i] = movies[i].movie_index;
        ratingsums[i] = movies[i].rating_sum;
        ratingcounts[i] = movies[i].rating_count;
    }
    return (movieindices, ratingsums, ratingcounts);
  }
}