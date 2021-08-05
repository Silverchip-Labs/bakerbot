import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import trainingData from './constants/bakerbot';

const model = tf.sequential();
// Add layers to the model
model.add(
    tf.layers.dense({
        inputShape: [512],
        activation: 'sigmoid',
        units: 2,
    }),
);
model.add(
    tf.layers.dense({
        inputShape: [2],
        activation: 'sigmoid',
        units: 2,
    }),
);
model.add(
    tf.layers.dense({
        inputShape: [2],
        activation: 'sigmoid',
        units: 2,
    }),
);
// Compile the model
model.compile({
    loss: 'meanSquaredError',
    optimizer: tf.train.adam(0.06), // This is a standard compile config
});

const encodeData = data => {
    const sentences = data.map(comment => comment.text.toLowerCase());
    const trainingData = use
        .load()
        .then(model => {
            return model.embed(sentences).then(embeddings => {
                return embeddings;
            });
        })
        .catch(err => console.error('Fit Error:', err));

    return trainingData;
};

const outputData = tf.tensor2d(
    trainingData.map(datum => [
        datum.intent === 'food' ? 1 : 0,
        datum.intent === 'no food' ? 1 : 0,
    ]),
); // Output: [1,0] or [0,1]

export const analyze = async testingData => {
    console.log('Analyzing...');

    try {
        const training_data = await encodeData(trainingData);
        const testing_data = await encodeData(testingData);

        const _ = await model.fit(training_data, outputData, { epochs: 200 });
        const data = await model.predict(testing_data).array();

        console.log('Success');
        console.log({ data });
        const formattedData = testingData.map((datum, i) => {
            return {
                ...datum,
                result: data[i],
            };
        });
        console.log({ formattedData });
        return formattedData;
    } catch (err) {
        console.log('Catch Err:', err);
    }
};

export const detectQuestion = async text => {
    const analysis = await analyze([{ text }]);
    if (analysis[0].result[0] > 0.5) return true;
    return false;
};
