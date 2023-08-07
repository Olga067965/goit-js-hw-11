import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scrollTo } from 'scroll-polyfill';

export const fetchImages = async (inputValue, pageNumber) => {
  return await fetch(
    `https://pixabay.com/api/?key=38684202-1b965ae9aa77d23174a7bb28f&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${pageNumber}`
  )
    .then(async res => {
      if (!res.ok) {
        if (res.status === 404) {
          return [];
        }
        throw new Error(res.status);
      }
      return await res.json();
    })
    .catch(error => {
      console.error(error);
    });
};

const input = document.querySelector('.search-form-input');
const searchButton = document.querySelector('.search-form-button');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

let pageNumber = 1;
let totalPages = null;

loadMoreButton.classList.add('d-none');

searchButton.addEventListener('click', async e => {
  e.preventDefault();
  clearGallery();

  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    try {
      const foundData = await fetchImages(trimmedValue, pageNumber);
      handleSearchResponse(foundData);
    } catch (error) {
      console.error(error);
    }
  } else {
    Notiflix.Notify.failure('Please enter a search query.');
    loadMoreButton.classList.add('d-none');
  }
});

loadMoreButton.addEventListener('click', async () => {
  pageNumber++;
  const trimmedValue = input.value.trim();
  loadMoreButton.classList.remove('d-none');

  try {
    const foundData = await fetchImages(trimmedValue, pageNumber);
    handleSearchResponse(foundData);
  } catch (error) {
    console.error(error);
  }
});

function handleSearchResponse(foundData) {
  if (foundData.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (pageNumber === 1) {
    Notiflix.Notify.success(`Hooray! We found ${foundData.totalHits} images.`);
  }

  totalPages = Math.ceil(foundData.totalHits / 40);

  if (pageNumber >= totalPages) {
    loadMoreButton.classList.add('d-none');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  renderImgLst(foundData.hits);

  if (pageNumber > 1) {
    scrollTheCollection();
  }

  gallerySimpleLightbox.refresh();
}

function renderImgLst(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span>${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span>${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span>${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreButton.classList.remove('d-none');
}

function scrollTheCollection() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  scrollTo({
    top: window.pageYOffset + cardHeight * 2,
    behavior: 'smooth',
  });
}
