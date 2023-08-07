import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

loadMoreButton.style.display = 'none';

let pageNumber = 1;

searchButton.addEventListener('click', e => {
  e.preventDefault();
  clearGallery();
  const trimmedValue = input.value.trim();
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, pageNumber).then(foundData => {
      if (foundData.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImgLst(foundData.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${foundData.totalHits} images.`
        );
        loadMoreButton.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    });
  }
});

loadMoreButton.addEventListener('click', () => {
  pageNumber++;
  const trimmedValue = input.value.trim();
  loadMoreButton.style.display = 'none';
  fetchImages(trimmedValue, pageNumber).then(foundData => {
    if (foundData.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImgLst(foundData.hits);
      Notiflix.Notify.success(
        `Hooray! We found ${foundData.totalHits} images.`
      );
      loadMoreButton.style.display = 'block';
    }
  });
});

function renderImgLst(images) {
  console.log(images, 'images');
  const markup = images
    .map(image => {
      console.log('img', image);
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
  gallery.innerHTML += markup;
}

function clearGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreButton.style.display = 'none';
}
