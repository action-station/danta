/*
 * this is a custom file to get and prepare data
 * with the following rules:
 *  - export an async function called get_data
 *  - do any data transformations in get_data
 */

import {
  existsSync as file_exists,
  writeFileSync as file_write,
  readFileSync as file_read
} from 'fs'
import {get_data as contentful_get_data} from '../../lib/contentful'

const more_key = {
  'article-page': 'Read More',
  'video-page': 'Watch Video'
}

const get_nav = ({pages, extra_nav_links}) => {
  const [, ...other_pages] = pages
  const page_links = other_pages.map(({name, title}, i) => (
    {url: `/${name}.html`, label: title}
  ))

  const extra_links = extra_nav_links || []

  return [
    {url: '/', label: 'Home'}, ...page_links, ...extra_links
  ].map(({url, label}, index) => (
    {index, url, label}
  ))
}

const get_augmented_list_page = page => ({
  ...page,
  pages: page.pages.map(p => ({
    ...p, more: more_key[p.content_type], more_link: `/${p.name}.html`
  }))
})

export async function get_data() {
  // IMPORT: MAKE SURE THERE IS NO MORE THAN 10 levels of linking
  // https://www.contentful.com/developers/docs/concepts/links/
  const data_file = './contentful_data_dev.json'
  let data = {}
  if(file_exists(data_file)) {
    data = JSON.parse(file_read(data_file))
  }
  else {
    data = await contentful_get_data({
      content_type: 'site', 'fields.name': 'annual-report-2020'
    })
    file_write(data_file, JSON.stringify(data))
  }

  const nav = get_nav(data)

  return {
    nav,
    ...{
      ...data, pages: data.pages.map(page => page.content_type === 'list-page'
        ? get_augmented_list_page(page)
        : page
      )
    }
  }
}
