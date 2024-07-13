import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  getPicturesByQuery,
  onFetchError,
  hideSpinner,
  pagination,
} from './js/pixabay-api';

import { renderImgCard, cardContainer } from './js/render-functions';

const searchForm = document.querySelector('.search-form');
const btn = document.querySelector('.btn');
const btnLoadMore = document.querySelector('.btn-load-more');
const hiddenClass = 'is-hidden';

let queryValue = '';
let totalPages = 0;

searchForm.addEventListener('submit', handleSearch);

function hide(button) {
  button.classList.add(hiddenClass);
}

function show(button) {
  button.classList.remove(hiddenClass);
}

function disable(button) {
  button.disabled = true;
}

function enable(button) {
  button.disabled = false;
}

hide(btnLoadMore); ///nide btn load more

async function handleSearch(event) {
  event.preventDefault();
  cardContainer.innerHTML = '';
  const form = event.currentTarget;
  queryValue = form.elements.query.value.trim();

  if (queryValue === '') {
    // перевірка на пустий інпут, та скидання форми
    iziToast.warning({
      title: 'Caution',
      message: 'Please, enter in the photo',
      position: 'topRight',
    });
    form.reset();
    return;
  }

  show(btnLoadMore);
  disable(btnLoadMore);

  try {
    let data = await getPicturesByQuery(queryValue);
    renderImgCard(data.hits);
    totalPages = Math.ceil(data.total / pagination.perPage);
    console.log('totalPages:', totalPages);
    console.log('pagination.page', pagination.page);

    if (pagination.page > totalPages) {
      return iziToast.error({
        position: 'topRight',
        message: "1We're sorry, there are no more posts to load",
      });
    }

    if (data.total === 0) {
      iziToast.warning({
        title: 'Caution',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
    }
    // hide(btn);
    enable(btnLoadMore);
    btnLoadMore.addEventListener('click', handleLoadMore);
  } catch (error) {
    console.error(error);
    onFetchError();
  } finally {
    hideSpinner();
    form.reset();
  }
}

async function handleLoadMore() {
  disable(btnLoadMore);
  pagination.page += 1;

  try {
    let data = await getPicturesByQuery(queryValue);
    renderImgCard(data.hits);
  } catch (error) {
    console.error(error);
    onFetchError();
  } finally {
    enable(btnLoadMore);
    hideSpinner();

    // якщо поточна сторінка рівна максимальні сторінці, то наступних сторінок не існує
    if (pagination.page === totalPages) {
      hide(btnLoadMore);
      btnLoadMore.removeEventListener('click', handleLoadMore);
    }
  }
}
