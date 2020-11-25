import axios from 'axios'

// IMPORTANT, strapi is installed on /usr/local/strapi

export async function fetch_data() {
  const {STRAPI_ENDPOINT} = process.env

  /* START CUSTOM */

  const get = async path => {
    const response = await axios.get(`${STRAPI_ENDPOINT}${path}`)

    return response.data
  }

  const {title, short_description} = await get('/common')

  console.log('TITLE', title)
  console.log('SHORT', short_description)

  return {
    title, short_description
  }

  /* END CUSTOM */
}
