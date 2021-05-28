import onChange from 'on-change';
import { renderList, renderError, removeButton } from './render';

export default (state, elements) => {
  const { container, button } = elements;
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'data':
        renderList(value, container);
        break;
      case 'filter.data':
        renderList(value, container);
        break;
      case 'page':
        removeButton(value, button);
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
