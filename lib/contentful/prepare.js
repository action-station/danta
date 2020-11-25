import {documentToHtmlString} from '@contentful/rich-text-html-renderer'

export function get_prepared_data(data) {
  const prepared_data = {}

  for(const property in data) {
    const part = data[property]
    let prepared = part

    if(property === 'sys') { continue }

    if(property === 'fields') { return get_prepared_data(part) }

    if(part.sys && part.fields) { prepared = get_prepared_data(part.fields) }

    if(Array.isArray(part)) { prepared = part.map(p => get_prepared_data(p)) }

    if(part.nodeType && part.nodeType === 'document') {
      prepared = documentToHtmlString(part)
    }

    prepared_data[property] = prepared
  }

  return prepared_data
}
