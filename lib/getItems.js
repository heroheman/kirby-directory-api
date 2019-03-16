import axios from 'axios';
import db from './db';

// constants
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

export async function get(url, issueCount) {
  const axiosPromises = [],
        pageCount = Math.ceil(issueCount / PER_PAGE);

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

export async function cleanUpData (data, type) {
  return data.map(item => ({
    item_type: type,
    title: item.title,
    number: item.number,
    id: item.id,
    html_url: item.html_url,
    labels: item.labels,
    body: item.body,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
}

// Get items
export async function getItems (url, type) {
  console.log(`${type.toUpperCase()} - Start fetch process`);
  // get total items
  const { total_count } = await getTotalCount(url);
  console.log(`${type.toUpperCase()} - Total Count: ${total_count}`);

  // get all items
  let items = await get(url, total_count);
  console.log(`${type.toUpperCase()} - Fetched Items: ${items.length}`);

  // Cleanup Items
  console.log(`${type.toUpperCase()} - Cleanup Items`);
  items = cleanUpData(items, type);
  return items;
}

export async function getThemes() {
  const type = 'themes';
  const themeUrl = `${BASE_URL}?q=is:open+repo:${REPO_THEMES}&sort=${SORT}&order=${ORDER}&per_page=${PER_PAGE}`;
  const themes = getItems(themeUrl, type);
  return themes;
}

export async function getPlugins() {
  const type = 'plugins';
  const pluginUrl = `${BASE_URL}?q=is:open+repo:${REPO_PLUGINS}&sort=${SORT}&order=${ORDER}&per_page=${PER_PAGE}`;
  const plugins = getItems(pluginUrl, type);
  return plugins;
}

export async function runCronFetch () {
  const [themes, plugins] = await Promise.all([
    getThemes(),
    getPlugins()
  ]);

  console.log('THEMES - Save to database');
  db
    .set('themes', themes)
    .write();

  console.log('PLUGINS - Save to database');
  db
    .set('plugins', plugins)
    .write();
}
