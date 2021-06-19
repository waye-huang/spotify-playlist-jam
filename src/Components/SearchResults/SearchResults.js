import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList
          onAdd={this.props.onAdd}
          tracks={this.props.searchResults}
          isRemoval={false}
        />
      </div>
    );
  }
}

export default SearchResults;

//Warning: Each child in a list should have a unique "key" prop. Check the render method of `TrackList`. See https://reactjs.org/link/warning-keys for more information. at Track (http://localhost:3000/static/js/main.chunk.js:1323:5) at TrackList (http://localhost:3000/static/js/main.chunk.js:1588:1) at div at SearchResults (http://localhost:3000/static/js/main.chunk.js:1099:1) at div at div at div at App (http://localhost:3000/static/js/main.chunk.js:288:5)
