import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const cardContainer = document.querySelector('.card-container');

let lightboxInstance;

async function lightbox() {
  if (!lightboxInstance) {
    lightboxInstance = new SimpleLightbox('.card-container a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
  } else {
    lightboxInstance.refresh();
  }
}

export async function renderImgCard(dataArr) {
  const markupImages = dataArr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item">
            <a class="gallery-link" href="${largeImageURL}">
                <img class="gallery-image" src="${webformatURL}" alt="${tags}" width="360" height="200"/>
                <ul class="gallery-text-list">
                    <li class="gallery-text-item"><h3>Likes</h3><p>${likes}</p></li>
                    <li class="gallery-text-item"><h3>Views</h3><p>${views}</p></li>
                    <li class="gallery-text-item"><h3>Comments</h3><p>${comments}</p></li>
                    <li class="gallery-text-item"><h3>Downloads</h3><p>${downloads}</p></li>
                </ul>
            </a>
        </li>`
    )
    .join('');
  cardContainer.insertAdjacentHTML('beforeend', markupImages);

  await lightbox();
}
