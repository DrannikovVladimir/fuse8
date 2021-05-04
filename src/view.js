import onChange from 'on-change';
import { renderLoading, renderList, renderError } from './render.js';

export default (state, container) => {
  const watchedState = onChange(state, (path, value) => {
    console.log(path, value);
    switch(path) {
      case 'data':
        renderList(value, container);
        break;
      case 'networkError':
        // renderError(value, container);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
