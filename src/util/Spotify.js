const clientID = 'c183751390b54c8fb6c66486ca98744c';
// const redirectUri = 'http://localhost:3000/';
const redirectUri = 'http://weSpotifysearch.surge.sh/';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    // check for access token
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      // console.log('accessTokenMatch[1]', accessTokenMatch[1]);
      // console.log('expiresInMatch[1]', expiresInMatch[1]);
      console.log('accessToken G2G', accessToken);
      return accessToken;
    } else {
      // const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email&response_type=token&state=123`;
      // console.log('accessURL', accessURL);
      window.location = accessURL;
    }
  },

  search(term) {
    const access_Token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${access_Token}`,
      },
    })
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((jsonResponse) => {
        console.log('Spotify search(term) jsonResponse:', jsonResponse);
        if (!jsonResponse.tracks) {
          return [];
        }
        const jR = jsonResponse.tracks.items.map((track) => ({
          album: track.album.name,
          artist: track.artists[0].name
            ? track.artists[0].name
            : track.artist.name,
          id: track.id,
          name: track.name,
          uri: track.uri,
        }));
        console.log('jsonResponse Tracks Array:', jR);
        return jR;
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris }),
              }
            );
          });
      });
  },
};

export default Spotify;

//'https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123';
//https://open.spotify.com/playlist/37i9dQZF1E38kX14LU6269?si=2cc249bf09584662
