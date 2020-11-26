/*
 * this is a custom file to get and prepare data
 * with the following rules:
 *  - export an async function called get_data
 *  - do any data transformations in get_data
 */

import {get_data as contentful_get_data} from '../../lib/contentful'

const get_nav = ({pages, extra_nav_links}) => {
  const nav_links = pages.map(({name, title}) => (
    {url: `/${name}.html`, label: title}
  ))

  return extra_nav_links ? [...nav_links, ...extra_nav_links] : nav_links
}

export async function get_data() {
  // IMPORT: MAKE SURE THERE IS NO MORE THAN 10 levels of linking
  // https://www.contentful.com/developers/docs/concepts/links/
  const data = await contentful_get_data({
    content_type: 'site', 'fields.name': 'site-test'
  })
  const nav = get_nav(data)

  return {nav, ...data}
}
