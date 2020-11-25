import axios from 'axios'

const {STRAPI_ENDPOINT} = process.env

// TODO: only works for public no credentials access
// need to add support for api credentials

export const get_data = async (path) => (
  await axios.get(`${STRAPI_ENDPOINT}${path}`)
).data
