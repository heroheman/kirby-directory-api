import axios from 'axios';
import db from './db';

const BASE_URL = "https://api.github.com/search/issues";
const TOKEN = "c718fc6014a171b3ddb9785c076a6bc969e9b924";
const REPO_THEMES = "wachilt/kirby-themes";
const REPO_PLUGINS = "texnixe/kirby-plugins";
const PER_PAGE = 100;
const SORT = "updated";
const ORDER = "desc";

// AXIOS CONFIGURATION
const config = {
  headers: {'Authorization': `token ${TOKEN}`}
};

export async function getItems (url, issueCount) {
  const axiosPromises = [],
        pageCount = Math.ceil(issueCount / PER_PAGE);

  console.log('Total Pages: ', pageCount);

  for (let page = 1; page <= pageCount; page++) {
    const pagePromise = axios.get(`${url}&page=${page}`, config);
    axiosPromises.push(pagePromise);
  }

  return Promise.all(axiosPromises)
    .then(responses => {
      return responses.map(response => response.data.items);
    })
    .then(results => {
      let items = [];
      results.forEach((result) => {
        items = items.concat(result);
      });
      return items;
    });
}


export async function getTotalCount (url) {
  const { data } = await axios.get(url, config);
  return data;
}

// Get Themes
export async function getThemes () {
  console.log('get themes');

  const URL = `${BASE_URL}?q=is:open+repo:${REPO_THEMES}&sort=${SORT}&order=${ORDER}&per_page=${PER_PAGE}`;

  // get total items
  const { total_count } = await getTotalCount(URL);
  console.log('Total Count: ', total_count);

  // get all items
  const items = await getItems(URL, total_count);

  console.log('length all fetched items', items.length);
  return items;
}

export async function runCronFetch () {
  const [themes] = await Promise.all([getThemes()]);

  console.log('Save themes to database');
  db
    .set('themes', themes)
    .write();
}
