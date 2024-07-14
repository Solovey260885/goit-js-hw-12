import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export const pagination = {
  page: 1,
  perPage: 15,
};
const spinner = document.querySelector('.loader');

function showSpinner() {
  spinner.style.display = 'flex';
}

export function hideSpinner() {
  spinner.style.display = 'none';
}

export async function getPicturesByQuery(query) {
  const params = new URLSearchParams({
    key: '44773491-691b01ebde89d181347bf66a7',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: pagination.perPage,
    page: pagination.page,
  });

  showSpinner();

  try {
    const response = await axios.get(`https://pixabay.com/api/?${params}`);
    return response.data;
  } catch (error) {
    onFetchError(error);
    throw error;
  } finally {
    hideSpinner();
  }
}

export function onFetchError(error) {
  iziToast.error({
    title: 'Error',
    message:
      '2Sorry, there are no images matching your search query. Please try again!',
    position: 'topRight',
  });
}
