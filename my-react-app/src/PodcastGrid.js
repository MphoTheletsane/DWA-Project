import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Header(props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    props.onSearch(searchTerm);
  };

  return (
    <div style={{ display: 'block', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
      <button onClick={props.onBack}>Back</button>
      <h1>The Hot Shows</h1>
      <form onSubmit={handleSearchSubmit}>
        <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search..." />
        <button type="submit">Search</button>
      </form>
      <select onChange={props.onSortOptionChange}>
        <option value="">Sort by:</option>
        <option value="az">Title A-Z</option>
        <option value="za">Title Z-A</option>
        <option value="dateAsc">Date Ascending</option>
        <option value="dateDesc">Date Descending</option>
      </select>
    </div>
  );
}

export function PodcastGrid(props) {
  const [rowData, setRowData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [sortOption, setSortOption] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeasonData, setSelectedSeasonData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://podcast-api.netlify.app/shows')
      .then(response => response.json())
      .then(shows => {
        const promises = shows.map(show => {
          return fetch(`https://podcast-api.netlify.app/id/${show.id}`)
            .then(response => response.json())
            .then(showData => {
              const id = showData.id;
              const title = showData.title;
              const description = showData.description;
              const seasons = showData.seasons;
              const image = showData.image;
              const genres = showData.genres ? showData.genres.join(', ') : '';
              const updated = showData.updated;
              const episodes = showData.episodes || [];

              return { id, title, description, seasons, image, genres, updated, episodes };
            });
        });

        Promise.all(promises)
          .then(data => {
            setRowData(data);
            setOriginalData(data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error:', error);
            setIsLoading(false);
          });
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedShow && selectedShow.seasons[selectedSeason - 1]) {
      setSelectedSeasonData(selectedShow.seasons[selectedSeason - 1].episodes);
    }
  }, [selectedSeason, selectedShow]);

  const carouselSettings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
  };

  const sortData = () => {
    let sortedData;
    switch (sortOption) {
      case 'az':
        sortedData = [...rowData].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        sortedData = [...rowData].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'dateAsc':
        sortedData = [...rowData].sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case 'dateDesc':
        sortedData = [...rowData].sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      default:
        sortedData = rowData;
        break;
    }
    setRowData(sortedData);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleFavorite = (id) => {
    setFavorites({
      ...favorites,
      [id]: {
        dateAdded: new Date().toLocaleDateString(),
        isFavorite: !favorites[id]?.isFavorite,
      },
    });
  };

  const handleGoBack = () => {
    console.log('Going back...');
    setSelectedShow(null);
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(parseInt(event.target.value, 10));
  };

  const handleSearch = (searchTerm) => {
    const options = {
      keys: ['title'],
      includeScore: true,
    };
    const fuse = new Fuse(originalData, options);
    const result = fuse.search(searchTerm);
    setRowData(result.map(({ item }) => item));
  };

  const handleGenreClick = (genre) => {
    const filteredData = originalData.filter((row) => row.genres.includes(genre));
    setRowData(filteredData);
  };

  const handleShowClick = (show) => {
    setSelectedShow(show);
    setSelectedSeason(1);
  };

  const handleEpisodePlay = (episodeId) => {
    console.log(`Playing episode with ID: ${episodeId}`);
  };

  return (
    <div style={{ height: props.height, width: props.width, backgroundColor: 'white', color: 'black', position: 'flex' }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Slider {...carouselSettings}>
            {rowData.map((row, index) => (
              <div key={`carousel-${index}`}>
                <img src={row.image} alt={row.title} style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }} />
              </div>
            ))}
          </Slider>

          {selectedShow ? (
            <>
              <Header onSearch={handleSearch} onSortOptionChange={handleSortOptionChange} onBack={handleGoBack} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2>{selectedShow.title}</h2>
                <p>{selectedShow.description}</p>
                <select onChange={handleSeasonChange} value={selectedSeason}>
                  {Array.from({ length: selectedShow.seasons.length }, (_, i) => i + 1).map((season) => (
                    <option key={season} value={season}>
                      Season {season}
                    </option>
                  ))}
                </select>
                <div>
                  <h3>Episodes:</h3>
                  <ul>
                    {selectedSeasonData.map((episode, index) => (
                      <li key={index}>
                        {episode.title}{' '}
                        <button onClick={() => handleEpisodePlay(episode.id)}>Play</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <Header onSearch={handleSearch} onSortOptionChange={handleSortOptionChange} onBack={handleGoBack} />
              <button onClick={sortData}>Sort</button>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {rowData.map((row, index) => (
                  <div key={index} style={{ marginBottom: '20px', backgroundColor: 'black', color: 'white', padding: '10px', flex: '0 0 30%', margin: '10px' }}>
                    <img src={row.image} alt={row.title} style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
                    <h2>{row.title}</h2>
                    <p>{row.description}</p>
                    <button onClick={() => handleShowClick(row)}>View Details</button>
                    <div style={{ marginTop: '10px' }}>
                      <button style={{ marginRight: '10px' }} onClick={() => handleFavorite(row.id)}>
                        {favorites[row.id]?.isFavorite ? `❤ Added to favorites on ${favorites[row.id].dateAdded}` : '❤'}
                      </button>
                    </div>
                    <div>
                      <h3>Genres:</h3>
                      {row.genres.split(', ').map((genre, index) => (
                        <span key={index} onClick={() => handleGenreClick(genre)} style={{ cursor: 'pointer' }}>
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}





