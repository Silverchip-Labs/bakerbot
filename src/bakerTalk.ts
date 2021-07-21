export const formatReply = (message: string) => {
    const oneInTen = Math.random() < 0.1;
    if (oneInTen) {
        return "Don't know";
    }
    const oneInTwenty = Math.random() < 0.05;
    if (oneInTwenty) {
        return 'Nothing mate';
    }
    const prefixIndex = Math.floor(Math.random() * prefixList.length);
    const prefix = prefixList[prefixIndex];

    let reply = `${prefix} ${message}`;
    const shouldAddSuffix = Math.random() > 0.66;

    if (shouldAddSuffix) {
        const suffixIndex = Math.floor(Math.random() * suffixList.length);
        reply += ` ${suffixList[suffixIndex]}`;
    } else {
        reply += '.';
    }

    return reply;
};

const prefixList = [
    'Its gotta be a fresh',
    'Mans getting',
    'Come at me bro',
    'Don\t you start',
    'Well!',
    'Well lad, I reckon',
    'Well, I reckon',
    'I think you should have',
    'What you want right, is',
];

const suffixList = [
    'yeah?',
    'right?',
    'right.',
    'right!',
    'living the dream.',
    'lad',
    'queen',
    'king',
    "I'm not a robot.",
    "I'm a robot.",
    'but you should be on a diet',
];
