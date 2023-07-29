import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

function toggleElement(e, s) {
  e.style.display = s ? 'block' : 'none';
}

function initialPage() {
  toggleElement(breedSelect, false);
  toggleElement(loader, true);
  fetchBreeds()
    .then(breeds => {
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });

      toggleElement(loader, false);
      toggleElement(breedSelect, true);
    })
    .catch(error => {
      showError(
        'Meow! 🐾 Please try again later. Thank you for your patience!😺'
      );
      toggleElement(loader, false);
    });
}

breedSelect.addEventListener('change', () => {
  catInfo.innerHTML = '';
  clearError();
  const selectedBreedId = breedSelect.value;
  toggleElement(loader, true);

  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      const image = document.createElement('img');
      image.src = cat.url;

      const catName = document.createElement('p');
      catName.innerHTML = `<strong>Breed:</strong> ${cat.breeds[0].name}`;

      const catDescription = document.createElement('p');
      catDescription.innerHTML = `<strong>Description:</strong> ${cat.breeds[0].description}`;

      const catTemperament = document.createElement('p');
      catTemperament.innerHTML = `<strong>Temperament:</strong> ${cat.breeds[0].temperament}`;

      catInfo.appendChild(image);
      catInfo.appendChild(catName);
      catInfo.appendChild(catDescription);
      catInfo.appendChild(catTemperament);

      toggleElement(loader, false);
    })
    .catch(error => {
      showError(
        'Meow! 🐾 Something went wrong with our cat-nection! Please try again later. Thank you for your patience!😺'
      );
      toggleElement(loader, false);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const error = document.querySelector('.error');
  error.style.display = 'none';
});

function showError(message) {
  error.textContent = message;
  error.style.display = 'block';
}

function clearError() {
  error.style.display = 'none';
}

initialPage();
