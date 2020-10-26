pragma solidity >=0.4.24 <0.6.0;

contract moviestorage {

  struct Movie {
    uint movie_index;
    uint rating_sum;
    uint rating_count;
  }
  
  mapping (uint => Movie) public movies;

  constructor () public {
    addMovie(0, 10, 2);
    addMovie(1, 12, 3);
    addMovie(2, 1, 1);
  }

   function addMovie (uint index, uint sum, uint count) private {
    movies[index].movie_index = index;
    movies[index].rating_sum = sum;
    movies[index].rating_count = count;
  }

  function getMovie(uint movie_index) public view 
  returns (uint ratingsum, uint ratingcount) {
    Movie memory m = movies[movie_index];
    ratingcount = m.rating_count;
    ratingsum = m.rating_sum;
    return (ratingsum, ratingcount);
  }
  
  function rateMovie(uint movie_index, uint rating) public
  returns (uint ratingsum, uint ratingcount) {
    movies[movie_index].rating_count += 1;
    movies[movie_index].rating_sum += rating;

    ratingsum = movies[movie_index].rating_sum;
    ratingcount = movies[movie_index].rating_count;
    return (ratingsum, ratingcount);
  }

  function getMovieList() public view 
  returns (uint256[200] memory movieindices, uint256[200] memory ratingsums, uint256[200] memory ratingcounts)
  {
    for (uint i = 0; i < 200; i++ ) {
        movieindices[i] = movies[i].movie_index;
        ratingsums[i] = movies[i].rating_sum;
        ratingcounts[i] = movies[i].rating_count;
    }
    return (movieindices, ratingsums, ratingcounts);
  }
}