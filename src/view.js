import onChange from 'on-change';
import { renderList, renderError } from './render.js';

export default (state, container) => {
  const watchedState = onChange(state, (path, value) => {
    console.log(path, value);
    switch(path) {
      case 'data':
        renderList(value, container);
        break;
      case 'filter.data':
        renderList(value, container);
        break;
      case 'error':
        renderError(value, container);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
