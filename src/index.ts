require('dotenv').config();
import TwitterApi from 'twitter-api-v2';

// Top level async function so we can await in script
(async () => {
    // ? Setup OAuth 1 client. Needed for general functions, logins, replies etc.
    const twitter = new TwitterApi({
        appKey: process.env.CONSUMER_KEY ?? '',
        appSecret: process.env.CONSUMER_SECRET ?? '',
        accessToken: process.env.ACCESS_TOKEN ?? '',
        accessSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
    });
    // ? OAuth 2 (app-only) - needed for streams and some v2 api functionality.
    const appTwitter = await twitter.appLogin();
    const me = await twitter.currentUser();

    // ? Setting up a search stream, to listen for tweets directed at the bot.
    const rules = await appTwitter.v2.streamRules();
    const ruleValue = '@' + me.screen_name;
    // Erase previous rules
    const doOtherRulesExist = rules?.data.find(({ value }) => value !== ruleValue);
    if (doOtherRulesExist) {
        await appTwitter.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
        });
    }
    // Add my search rule
    const doesRuleExist = rules?.data?.find(({ value }) => value === ruleValue);
    if (!doesRuleExist) {
        await appTwitter.v2.updateStreamRules({
            add: [{ value: '@' + me.screen_name }],
        });
    }

    // ? Establish tweet stream
    const stream = await appTwitter.v2.searchStream({
        'tweet.fields': ['in_reply_to_user_id'],
    });
    // ? Handle tweets from stream
    for await (const { data: tweet } of stream) {
        console.log({ tweet });
        // If the bot is not directly mentioned, ignore
        if (tweet.in_reply_to_user_id !== me.id_str) continue;
        // ? Like the tweet
        await twitter.v2.like(me.id_str, tweet.id);
        // todo generate lunch suggestions
        const lunchSuggestion = '';
        twitter.v1.reply(lunchSuggestion, tweet.id).catch((err: Error) => console.log(err.message));
        // ? follow user that asked for lunch
        if (!!tweet.author_id && tweet.author_id !== me.id_str) {
            const following = await appTwitter.v2.following(me.id_str);
            // don't follow if already following
            if (following.data.find(dat => dat.id === tweet.author_id)) continue;
            const user = await appTwitter.v2.user(tweet.author_id);
            await appTwitter.v2.follow(me.id_str, user.data.id);
        }
    }
    // todo daily tweet at lunchtime?
})().catch(console.log);
