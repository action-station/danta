import {render} from 'mustache'
import {
  existsSync as file_exists,
  writeFileSync as file_write,
  readFileSync as file_read
} from 'fs'
import {execSync as exec} from 'child_process'
import path from 'path'
import {set_env, get_data, get_file_data} from './build'
import {get_templates} from '../lib/templates'

set_env('dev')

async function build_dev() {
  // build css (should scss be used instead?)
  exec('yarn sass ./client/scss/index.scss dist/index.css')

  // TODO, support constants in webpack.config.js
  //exec('webpack')

  // get all templates, one per content type in the cms
  const templates = get_templates()

  // get data from the cms
  const data = await get_data('dev')

  // get file related data
  const file_data = await get_file_data(data)

  // build html
  for(const {name, template_name, data: template_data} of file_data) {
    const {[template_name]: template, ...partials} = templates
    const html = render(template, {...template_data, common: data}, partials)

    // inject css file
    const injected_html = html
      .replace('</head>', `
          <link rel="stylesheet" href="/index.css">
        </head>
      `)

    // TODO: minify html
    file_write(`./dist/${name}.html`, injected_html)
  }
}

(async () => {
  const StaticServer = require('static-server')
  const server = new StaticServer({rootPath: './dist', port: 3000, cors: '*', followSymlink: true})
  server.on('request',  async (req, res) => await build_dev())
  server.start(() => console.log('danta app running on', server.port))
})()
