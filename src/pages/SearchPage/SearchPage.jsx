import axios from "../../api/axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchPage.css";
import { useDebounce } from "../../hooks/useDebounce";

export default function SearchPage() {
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  const searchTerm = query.get("q");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSearchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchSearchResults = async (debouncedSearchTerm) => {
    try {
      const request = await axios.get(`/search/multi?query=${debouncedSearchTerm}`);
      setSearchResults(request.data.results);
    } catch (error) {
      console.error("error", error);
    }
  };

  const renderSearchResults = () => {
    return searchResults.length > 0 ? (
      <section className='search-container'>
        {searchResults.map((movie) => {
          if (movie.backdrop_path !== null && movie.poster_path !== "person") {
            const movieImageUrl = "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
            return (
              <div className='movie' key={movie.id}>
                <div className='movie__column-poster'>
                  <img src={movieImageUrl} onClick={() => navigate(`/${movie.id}`)} alt='' className='movie__poster' />
                </div>
              </div>
            );
          }
          return null;
        })}
      </section>
    ) : (
      <section className='no-results'>
        <div className='no-results__text'>
          <p>찾고자 하는 검색어 "{debouncedSearchTerm}"에 맞는 영화가 없습니다.</p>
        </div>
      </section>
    );
  };

  return renderSearchResults();
}
