/*
 * mustache render recursively
 * @TODO
 * - better error handling and display
 * - make recursion clearer
 * - allow params to specify entry folder
 * - ignore non mustache files
 */

import {readdirSync, lstatSync, readFileSync} from 'fs'
import {render} from 'mustache'

/*
const templates = {}
const load_templates = (dir_path, views_path) => readdirSync(dir_path).flatMap(file => {
  const file_path = `${dir_path}/${file}`

  if(lstatSync(file_path).isDirectory()) {
    return load_templates(file_path)
  }

  const key = file_path.replace(`${views_path}/`, '').replace('.mustache', '')
  templates[key] = readFileSync(file_path, 'utf-8')
})
*/

export async function build_html(
  template_key, data = {}, views_path = './client/views'
) {
  //if(Object.entries({}).length === 0) {
  //  load_templates(views_path, views_path)
  //}

  const {[template_key]: template, ...partials} = templates

  return render(template, data, partials)
}
