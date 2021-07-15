require('dotenv').config();
import * as Twit from 'twit';

const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY ?? '',
    consumer_secret: process.env.CONSUMER_SECRET ?? '',

    access_token: process.env.ACCESS_TOKEN ?? '',
    access_token_secret: process.env.ACCESS_TOKEN_SECRET ?? '',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
});
T.get('search/tweets', { q: 'banana since:2011-07-11', count: 5 }, function (err, data, response) {
    console.log(data);
});
