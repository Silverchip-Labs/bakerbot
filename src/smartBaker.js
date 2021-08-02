import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import trainingData from './constants/bakerbot';

const [isAnalyzing, setIsAnalyzing] = useState(false);
const [analyzeError, setAnalyseError] = useState(null);
const [result, setResult] = useState([]);

const model = tf.sequential();
// Add layers to the model
model.add(
    tf.layers.dense({
        inputShape: [512],
        activation: 'sigmoid',
        units: 4,
    }),
);
model.add(
    tf.layers.dense({
        inputShape: [4],
        activation: 'sigmoid',
        units: 4,
    }),
);
model.add(
    tf.layers.dense({
        inputShape: [4],
        activation: 'sigmoid',
        units: 4,
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
        datum.intent === 'joke' ? 1 : 0,
        datum.intent === 'question' ? 1 : 0,
        datum.intent === 'compliment' ? 1 : 0,
    ]),
); // Output: [1,0] or [0,1]

export const analyze = testingData => {
    console.log('Analyzing...');
    setIsAnalyzing(true);
    setAnalyseError(null);

    Promise.all([encodeData(trainingData), encodeData(testingData)])
        .then(data => {
            const { 0: training_data, 1: testing_data } = data;
            return model
                .fit(training_data, outputData, { epochs: 200 })
                .then(history => {
                    return model.predict(testing_data).array();
                    // model.predict(testing_data).print();
                })
                .then(data => {
                    console.log('Success');
                    console.log({ data });
                    const formattedData = testingData.map((datum, i) => {
                        return {
                            ...datum,
                            result: data[i],
                        };
                    });
                    console.log({ formattedData });
                    setIsAnalyzing(false);
                    setResult(formattedData);
                })
                .catch(error => {
                    console.log('Error');
                    console.error({ error });
                    setIsAnalyzing(false);
                    setAnalyseError(error);
                });
        })
        .catch(err => console.log('Prom Err:', err));
};
