import commentTrainingNone from "./comment-training-none";
import commentTrainingBuy from "./comment-training-buy";

const none = commentTrainingNone.map((text) => {
  return { text, intent: "none" };
});
const buy = commentTrainingBuy.map((text) => {
  return { text, intent: "buy" };
});

const commentsTraining = [...buy, ...none];

export default commentsTraining;
