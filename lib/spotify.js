import SpotifyWebApi from "spotify-web-api-node"

const scopes = [
    'streaming',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-playback-state',
    'user-read-email',
    'user-read-private',
    'user-read-currently-playing',
    'user-modify-playback-state',
    'user-follow-modify',
    'user-follow-read',
].join(",");

const params = {
    scope: scopes,
};


const queryParamString = new URLSearchParams(params);

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + queryParamString.toString();

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

export default spotifyAPI;
export { LOGIN_URL };