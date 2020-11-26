import {readdirSync, lstatSync, readFileSync} from 'fs'

const templates = {}
const load_templates = (dir_path, views_path) => readdirSync(dir_path).flatMap(file => {
  const file_path = `${dir_path}/${file}`

  if(lstatSync(file_path).isDirectory()) {
    return load_templates(file_path, views_path)
  }

  const key = file_path.replace(`${views_path}/`, '').replace('.mustache', '')
  templates[key] = readFileSync(file_path, 'utf-8')
})

export const get_templates = (views_path = './client/views') => {
  load_templates(views_path, views_path)

  return templates
}
