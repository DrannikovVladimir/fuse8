const createItem = ({ address, id, title, image, price, type }) => {
  const mappingClass = {
    IndependentLiving: 'living',
    SupportAvailable: 'available',
  };

  const li = document.createElement('li');
  li.classList.add('list__item');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('list__item-image-container');

  const img = document.createElement('img');
  img.src = image;
  img.alt = title;
  img.width = 377;
  img.height = 227;
  img.classList.add('list__item-image');

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('list__item-content-container');

  const titleItem = document.createElement('h2');
  titleItem.classList.add('list__item-title');
  titleItem.textContent = title;

  const addressItem = document.createElement('p');
  addressItem.classList.add('list__item-address');
  addressItem.textContent = address;

  const priceItem = document.createElement('span');
  priceItem.classList.add('list__item-price');
  priceItem.textContent = price;

  const priceItemText = document.createElement('p');
  priceItemText.classList.add('list__item-price-text');
  priceItemText.textContent = 'New Properties for Sale from ';
  priceItemText.appendChild(priceItem);

  const description = document.createElement('p');
  description.classList.add('list__item-description');
  description.textContent = 'Shared Ownership Available';

  const typeItem = document.createElement('p');
  typeItem.classList.add(`list__item-type`, `list__item-type--${mappingClass[type]}`);
  typeItem.textContent = type;

  contentContainer.append(titleItem, addressItem, priceItemText, description, typeItem);
  imageContainer.appendChild(img);
  li.append(imageContainer, contentContainer);

  return li;
}

const renderList = (items, container) => {
  if (items.length === 0) {
    return;
  }

  const ul = document.createElement('ul');
  ul.classList.add('list');
  items.map((item) => {
    const card = createItem(item);
    ul.appendChild(card);
  });

  container.appendChild(ul);
};

const renderError = (error, container) => {
  return null;
};

const renderLoading = (container) => {

};

export { renderList, renderError, renderLoading };