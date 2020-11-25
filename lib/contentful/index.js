import {createClient} from 'contentful'
import {get_prepared_data} from './prepare'

export const get_data = async (params, include = 10) => {
  const {CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE} = process.env

  const client = createClient({
    accessToken: CONTENTFUL_ACCESS_TOKEN, space: CONTENTFUL_SPACE
  })

  const {items: [data]} = await client.getEntries({...params, include})

  return get_prepared_data(data)
}
