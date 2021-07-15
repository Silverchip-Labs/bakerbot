require('dotenv').config();
import TwitterApi from 'twitter-api-v2';

// Set up client with dotenv file/env variables
const twitter = new TwitterApi({
    appKey: process.env.CONSUMER_KEY ?? '',
    appSecret: process.env.CONSUMER_SECRET ?? '',
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: process.env.ACCESS_TOKEN ?? '',
    accessSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
});
const client = twitter.readWrite;

// Top level async function so we can await in script
(async () => {
    const me = await client.currentUser();
    console.log({ me });
    const user = await client.v2.userByUsername('robfairclough');
    console.log({ user });
    await client.v2.follow(me.id_str, user.data.id);
})().catch(console.log);
