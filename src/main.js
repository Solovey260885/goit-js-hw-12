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
const btnLoadMore = document.querySelector('.btn-load-more');
const spinner = document.querySelector('.loader');
const hiddenClass = 'is-hidden';

let queryValue = '';
let totalPages = 0;

searchForm.addEventListener('submit', handleSearch);

export function showSpinner() {
  spinner.style.display = 'flex';
}

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

hide(btnLoadMore);

async function handleSearch(event) {
  event.preventDefault();
  cardContainer.innerHTML = '';
  const form = event.currentTarget;
  queryValue = form.elements.query.value.trim();

  if (queryValue === '') {
    disable(btnLoadMore);
    iziToast.warning({
      title: 'Caution',
      message: 'Please, enter in the photo',
      position: 'topRight',
    });
    form.reset();
    return;
  }

  try {
    let data = await getPicturesByQuery(queryValue);
    renderImgCard(data.hits);
    show(btnLoadMore);
    totalPages = Math.ceil(data.total / pagination.perPage);

    if (pagination.page > totalPages) {
      hide(btnLoadMore);
      return iziToast.error({
        position: 'topRight',
        message: "We're sorry, there are no more posts to load",
      });
    }
    enable(btnLoadMore);

    btnLoadMore.addEventListener('click', handleLoadMore);
  } catch (error) {
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

    const galleryItem = document.querySelector('.gallery-item');
    const itemHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({
      top: itemHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error(error);
    onFetchError();
  } finally {
    enable(btnLoadMore);

    if (pagination.page >= totalPages) {
      hide(btnLoadMore);

      btnLoadMore.removeEventListener('click', handleLoadMore);
      iziToast.warning({
        title: 'Caution',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
    hideSpinner();
  }
}
