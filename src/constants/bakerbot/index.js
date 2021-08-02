import foodTraining from "./baker-food";
import jokeTraining from "./baker-joke";
import questionTraining from "./baker-question";
import complimentTraining from "./baker-compliment";

const food = foodTraining.map((text) => {
  return { text, intent: "food" };
});
const joke = jokeTraining.map((text) => {
  return { text, intent: "joke" };
});
const question = questionTraining.map((text) => {
  return { text, intent: "question" };
});
const compliment = complimentTraining.map((text) => {
  return { text, intent: "compliment" };
});

const bakerTraining = [...food, ...joke, ...question, ...compliment];

export default bakerTraining;
