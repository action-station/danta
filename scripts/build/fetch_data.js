import {get_data} from '../../lib/contentful'

export async function fetch_data() {
  /* START CUSTOM */

  // IMPORT: MAKE SURE THERE IS NO MORE THAN 10 levels of linking
  // https://www.contentful.com/developers/docs/concepts/links/
  return await get_data({content_type: 'site', 'fields.name': 'site-test'})

  /* END CUSTOM */
}
