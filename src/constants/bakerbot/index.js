import foodTraining from './baker-food';
import noFoodTraining from './baker-nofood';

const food = foodTraining.map(text => {
    return { text, intent: 'food' };
});
const noFood = noFoodTraining.map(text => {
    return { text, intent: 'no food' };
});

const bakerTraining = [...food, ...noFood];

export default bakerTraining;
