import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { refreshAccessToken } from "spotify-web-api-node/src/server-methods"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)
        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //equals 1 hour

            refreshToken: refreshedToken.refresh_token ? token.refreshToken
        }
    } catch (error) {
        console.log(error)
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL,
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }) {
            //if initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000, //Handling expiring time in milliseconds
                }
            }
            //Return the prev token if access token is not expired
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }
            //Access token has expired, so we need to refresh it...
            return await refreshAccessToken(token)
        }
    }
})