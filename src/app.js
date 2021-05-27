import axios from 'axios';
import watchedState from './view';

const URL = `https://interview-test-task-api.herokuapp.com/pages?page=1`;

const getData = (url) => axios.get(url, { timeout: 5000 });

const toUpperFirstLetter = (word) => {
  const firstLetter = word[0].toUpperCase();
  const restOfWord = word.slice(1);
  return `${firstLetter}${restOfWord}`;
};

const updateData = (items) => items
  .map((item, index) => ({
    ...item,
    image: {
      jpg: `./images/${index + 1}.jpg`,
      webp: `./images/${index + 1}.webp`,
    },
    title: toUpperFirstLetter(item.title),
  }));

const filterData = (items, value) => items
  .filter((item) => item.title.toLowerCase().includes(value));

export default () => {
  const state = {
    status: 'loading',
    data: [],
    page: 1,
    error: null,
    filter: {
      value: '',
      data: [],
    },
  };

  const filter = document.querySelector('.form-filter__input');
  const button = document.querySelector('.projects__button');
  const container = document.querySelector('.projects__container-list');
  const watched = watchedState(state, container);

  const getItems = (page) => {
    const data = axios.get(`https://interview-test-task-api.herokuapp.com/pages?page=${page}`)
      .then(({ data }) => {
        console.log(data.items);
        watched.page = data.nextPage;
        return updateData(data.items); //Ошибка была в это строчке, забыл вернуть данные из промиса, добавил return
      })
      .then((coll) => {
        console.log(coll);
        watched.data = [...state.data, ...coll];
      });

    return data;
  };

  button.addEventListener('click', () => {    
    console.log(state.page);
    getItems(state.page);    
  });

  filter.addEventListener('input', (evt) => {
    if (evt.target.value.length <= 3) {
      watched.filter.data = state.data;
      return;
    }
    watched.filter.value = evt.target.value;
    const filteredData = filterData(state.data, evt.target.value);
    watched.filter.data = filteredData;
  });

  return getData(URL)
    .then(({ data }) => {
      const { items } = data;
      const newData = updateData(items);
      watched.data = [...state.data, ...newData];
      watched.status = 'finished';
      watched.error = null;
    })
    .catch((err) => {
      watched.networkError = 'Превышено время ожидания';
      const error = new Error(err.message);
      throw error;
    });
};
