import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Demo.css'

function useFetchFilms() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);

  useEffect(() => {
    setStatus('loading');

    axios.get('https://swapi.dev/api/films/')
      .then((res) => {
        setStatus('success');
        setData(res.data.results);
      })
      .catch(() => {
        setStatus('error');
      });

  }, []);

  return {
    status,
    data,
  };
}

export function AxiosFetchDemo() {
  const { status, data: films } = useFetchFilms();

  if (status === 'loading') {
    return <p>Fetching Star Wars data...</p>;
  }

  if (status === 'error') {
    return <p>Could not fetch Star Wars data</p>;
  }

  return (
    <div className="films-grid">
      {films.map((film) => (
        <FilmCard key={film.episode_id} film={film} />
      ))}
    </div>
  );
}


export function FilmCard({ film }) {
  return (
    <article className="film-card">
      <h4 className="film-title">{film.title}</h4>
      <p>{film.opening_crawl}</p>
    </article>
  );
}