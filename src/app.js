import axios from 'axios';
import watchedState from './view';

const getData = (url) => axios.get(url);

const getRandomNumber = (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min);

const toUpperFirstLetter = (word) => {
  const firstLetter = word[0].toUpperCase();
  const restOfWord = word.slice(1);
  return `${firstLetter}${restOfWord}`;
};

const updateData = (items) => items
  .map((item) => ({
    ...item,
    image: `./images/${getRandomNumber(1, 6)}.jpg`,
    title: toUpperFirstLetter(item.title),
  }));

export default () => {
  const state = {
    status: 'loading',
    data: [],
    networkError: null,
  };

  const container = document.querySelector('.projects__container-list');
  const watched = watchedState(state, container);

  return getData('https://603e38c548171b0017b2ecf7.mockapi.io/homes')
    .then(({ data }) => {
      const newData = updateData(data);
      watched.data = [...state.data, ...newData];
      watched.status = 'finished';
      watched.networkError = null;
    })
    .catch((err) => {
      watched.status = 'failed';
      watched.networkError = err.message;
    });
};
