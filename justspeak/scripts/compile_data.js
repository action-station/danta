require('dotenv').config({ path: '/var/local/justspeak.conf' })

import Strapi from 'strapi-sdk-javascript'
import showdown from 'showdown'
import download from 'image-downloader'

const [,, slug, production] = process.argv
const { STRAPI_ENDPOINT, STRAPI_USERNAME, STRAPI_PASSWORD } = process.env
const m2h = new showdown.Converter()

;(async () => {
  const strapi = new Strapi(STRAPI_ENDPOINT)
  await strapi.login(STRAPI_USERNAME, STRAPI_PASSWORD)
  const page = (await strapi.getEntries('pages', {slug})).pop()
  const prefix = !production ? '' : `/${slug}`

  const get_file_url = url => `${STRAPI_ENDPOINT}${url}`

  const get_background = async (background_color = null, background_image = null) => {
    const background_image_url = background_image
      ? get_file_url(background_image.url)
      : null

    if(background_image_url) {
      await download.image({
        url: background_image_url,
        dest: `${__dirname}/../website/uploads`
      })

      return [
        background_image_url ? `background-image: url(${prefix}${background_image.url})`: ''
      ].join(';').trim()
    }

    return [
      background_color ? `background-color: ${background_color}` : ''
    ].join(';').trim()
  }

  const get_prepared_card = async (card, index = 0) => {
    const {logo, background_color, background_image, content, ...rest} = card

    if(logo) {
      await download.image({
        url: get_file_url(logo.url),
        dest: `${__dirname}/../website/uploads`
      })
    }

    let parsed_content = m2h.makeHtml(content)
      .replace(/\/uploads\//gi, `${prefix}/uploads/`)
      .replace(/\/img\//gi, `${prefix}/img/`)
    for(const key in page) {
      parsed_content = parsed_content.replace(new RegExp(`{{${key}}}`, 'gi'), page[key])
    }

    return {
      ...rest,
      scroll_indicator: index < 4 ? true : false,
      scroll_link: `#card${index + 2}`,
      logo: logo ? `${prefix}${logo.url}` : '',
      background: await get_background(background_color, background_image),
      content: parsed_content
    }
  }

  const get_card_data = async (card, index = 0) => {
    const {sub_cards: sub_card_ids} = card

    const sub_cards_name = `sub_cards_${card.name}`
    let sub_cards = []
    if(sub_card_ids.length > 0) {
      for(const sub_card_id of sub_card_ids) {
        const sub_card_data = await strapi.getEntry('cards', sub_card_id)
        sub_cards.push(await get_prepared_card(sub_card_data))
      }
    }

    return {
      ...await get_prepared_card(card, index),
      sub_cards_name,
      has_sub_cards: sub_cards.length > 0,
      sub_cards: sub_cards.length > 0 ? sub_cards : false,
      show_footer: index === 4
    }
  }


  const menu_items = []
  for (const menu_item of page.menu_items) {
    const {background_color, background_image, ...rest} = menu_item

    menu_items.push({
      ...rest,
      background: await get_background(
        background_color,
        background_image
      )
    })
  }


  const cards = []
  for(const card of page.cards) {
    cards.push(await get_card_data(card, cards.length))
  }

  const data = {
    ...page,
    menu_items: {
      top_left: menu_items[0],
      top_right: menu_items[1],
      bottom_left: menu_items[2],
      bottom_right: menu_items[3],
    },
    cards,
    slug: !production ? '' : page.slug,
    version: Date.now()
  }

  console.log(JSON.stringify(data, null, 2))
})()
