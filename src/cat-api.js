import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_42TXJLvCZUd3jxmdKmCDxPQ5q0bm82vvmi1l01YKQexqkDCKcCv7MhVCK9ckA4l1';

const API_BASE_URL = 'https://api.thecatapi.com/v1';

export const fetchBreeds = () => {
  return axios.get(`${API_BASE_URL}/breeds`).then(response => response.data);
};

export function fetchCatByBreed(breedId) {
  return axios
    .get(`${API_BASE_URL}/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0]);
}
