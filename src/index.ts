require('dotenv').config();
import TwitterApi from 'twitter-api-v2';
import { formatReply } from './bakerTalk';
import { getPlaceToEat } from './places';
import { setupStream } from './twitter';

// ? Top level async function so we can await in script
(async () => {
    // ? https://github.com/plhery/node-twitter-api-v2#readme
    // * Setup OAuth 1 client. Needed for general functions, logins, replies etc.
    const twitter = new TwitterApi({
        appKey: process.env.CONSUMER_KEY ?? '',
        appSecret: process.env.CONSUMER_SECRET ?? '',
        accessToken: process.env.ACCESS_TOKEN ?? '',
        accessSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
    });
    // * OAuth 2 (app-only) - needed for streams and some v2 api functionality.
    const appTwitter = await twitter.appLogin();
    const me = await twitter.currentUser();

    // ? https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md#streaming-bot-that-listens-for-tweets-that-mention-them-and-replies-with-a-reversed-tweet-content
    // * Setting up a search stream, to listen for tweets directed at the bot.
    const stream = await setupStream(appTwitter, me);

    // * Handle tweets from stream
    for await (const { data: tweet } of stream) {
        console.log({ tweet });
        // * If the bot is not directly mentioned, ignore
        if (tweet.in_reply_to_user_id !== me.id_str) continue;
        // * Like the tweet
        await twitter.v2.like(me.id_str, tweet.id);
        // todo add baker brags about having lots of money

        // todo generate lunch suggestions
        // todo add ratings to suggestions
        const placeToEat = await getPlaceToEat();
        const lunchSuggestion = formatReply(placeToEat);
        const isQuestion = tweet.text.includes('?');
        if (isQuestion) {
            twitter.v1
                .reply(lunchSuggestion, tweet.id)
                .catch((err: Error) => console.log(err.message));
        } else {
            twitter.v1
                .reply('you alright pal?', tweet.id)
                .catch((err: Error) => console.log(err.message));
        }
        // * follow user that asked for lunch
        if (!!tweet.author_id && tweet.author_id !== me.id_str) {
            // * don't follow if already following
            const user = await appTwitter.v2.user(tweet.author_id);
            try {
                await appTwitter.v2.follow(me.id_str, user.data.id);
            } catch {
                console.log('didnt work');
            }
        }
    }
    // todo daily tweet at lunchtime?
})().catch(console.log);
