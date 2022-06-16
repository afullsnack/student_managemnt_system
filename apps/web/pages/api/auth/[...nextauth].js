import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { url } from "../../../lib/config";

export default NextAuth({
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch(`${url}/api/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        // console.log(user, "Returned user data");

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // Passwordless / email sign in
    // Providers.Email({
    //   server: process.env.MAIL_SERVER,
    //   from: "NextAuth.js <no-reply@example.com>",
    // }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      session.user.id = token.id;
      session.user.name = token.name;
      // console.log(token, "SESSION DATA");
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      token.name = user?.name || `${profile?.lastname} ${profile?.firstname}`;
      token.id = user?._id;
      // console.log(token, user, account, profile, "TOKEN DATA");
      return token;
    },

    // async redirect(url, _baseUrl) {
    //   if (url == "/") {
    //     return Promise.resolve("/");
    //   }

    //   return Promise.resolve("/");
    // },
  },
  // Optional SQL or MongoDB database to persist users
  database: process.env.MONGODB_URI,
  nextauth_url: process.env.NEXTAUTH_URL,
});
