import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import SpotifyAPI, { LOGIN_URL } from '../../../lib/spotify';

async function refreshAccessToken(token) {
    try {
        SpotifyAPI.setAccessToken(token.accessToken);
        SpotifyAPI.setAccessToken(token.refreshToken);

        const { body: refreshedToken } = await SpotifyAPI.refreshAccessToken();

        console.log('Refreshed token is', refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ? refreshedToken.refresh_token : token.refreshToken,
        };
    } catch (error) {
        console.error(error);

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: '50538505dd3b4339bc0d0e4296f759cd',
            clientSecret: 'b8fdc28889dc4ed68af7c3839d880647',
            authorization: LOGIN_URL,
        }),
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // Initial Sign In
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                };
            }

            // Return previous token if the access token hasn't expired yet
            if (Date.now() < token.accessTokenExpires) {
                console.log('Token is valid ...');
                return token;
            }

            // Access Token expired, so refresh it...token
            console.log('Token expired, refreshing...');
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session;
        },
    },
});