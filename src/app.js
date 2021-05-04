import axios from 'axios';
import watchedState from './view';

const getData = (url) => axios.get(url);

const getRandomNumber = (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min);

const toUpperFirstLetter = (word) => {
  const firstLetter = word[0].toUpperCase();
  const restOfWord = word.slice(1);
  return `${firstLetter}${restOfWord}`;
};

const generateLabel = ({ id, type }) => {
  const mappingColor = {
    IndependentLiving: '#006F79',
    SupportAvailable: '#EC6608',
  };
  const mappingName = {
    IndependentLiving: 'Independent living',
    SupportAvailable: 'Restaurant & Support available',
  }

  return {
    color: mappingColor[type], name: mappingName[type], type, itemId: id,
  }
}

const generateLabels = (items) => {
  return items.map((item) => generateLabel(item))
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
    uiState: {
      labels: [],
    },
  };

  const container = document.querySelector('.projects__container-list');
  const watched = watchedState(state, container);

  return getData('https://603e38c548171b0017b2ecf7.mockapi.io/homes')
    .then(({ data }) => {
      const newData = updateData(data);
      const labels = generateLabels(data);
      watched.data = [...state.data, ...newData];
      watched.uiState.labels = [...state.uiState.labels, ...labels];
      watched.status = 'finished';
      watched.networkError = null;
    })
    .catch((err) => {
      watched.status = 'failed';
      watched.networkError = err.message;
    });
};
