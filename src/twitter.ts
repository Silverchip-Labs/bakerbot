import { TwitterApi, UserV1 } from 'twitter-api-v2';

export const setupStream = async (appTwitter: TwitterApi, me: UserV1) => {
    const rules = await appTwitter.v2.streamRules();
    const ruleValue = '@' + me.screen_name;
    // * Erase previous rules
    const doOtherRulesExist = rules?.data.find(({ value }) => value !== ruleValue);
    if (doOtherRulesExist) {
        await appTwitter.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
        });
    }
    // * Add my search rule
    const doesRuleExist = rules?.data?.find(({ value }) => value === ruleValue);
    if (!doesRuleExist) {
        await appTwitter.v2.updateStreamRules({
            add: [{ value: '@' + me.screen_name }],
        });
    }
    // * Establish tweet stream
    const stream = await appTwitter.v2.searchStream({
        'tweet.fields': ['in_reply_to_user_id', 'author_id', 'geo'],
    });

    return stream;
};
