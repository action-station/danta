import {documentToHtmlString} from '@contentful/rich-text-html-renderer'

const is_array = o => Array.isArray(o)
const is_object = o => !is_array(o) && o instanceof Object
const is_document = o => is_object(o) && o.nodeType && o.nodeType === 'document'

export function get_prepared_data(data) {
  const {sys, fields} = data
  const prepared_data = {}
  const properties = fields || data

  for(const property in properties) {
    const part = properties[property]
    let prepared = part

    if(is_document(part)) { prepared = documentToHtmlString(part) }

    if(is_object(part) && !is_document(part)) {
      prepared = get_prepared_data(part)
    }

    if(is_array(part)) { prepared = part.map(p => get_prepared_data(p)) }

    prepared_data[property] = prepared
  }

  return {
    content_type: sys && sys.contentType ? sys.contentType.sys.id : null,
    ...prepared_data
  }
}
