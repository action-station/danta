import dotenvJSON from 'dotenv-json'
import {
  existsSync as file_exists,
  writeFileSync as file_write,
  readFileSync as file_read
} from 'fs'
import {execSync as exec} from 'child_process'
import path from 'path'
import {set_env, fetch_data, build_html} from './build'

const data_filepath = path.resolve(__dirname, '../data_dev.json')
let data = {}

set_env('dev')

async function build_dev() {
  if(!file_exists(data_filepath)) {
    data = await fetch_data('dev')
    //file_write('./data_dev.json', JSON.stringify(data))
  }

  //data = JSON.parse(file_read('./data_dev.json', 'utf8'))

  const html = await build_html(data)

  // TODO, support constants in webpack.config.js
  exec('webpack')

  // TODO run scss
  exec('yarn sass ./client/scss/index.scss dist/index.css')

  const injected_html = html
    .replace('</body>', `
        <script src="/index.js"></script>
      </body>
    `)
    .replace('</head>', `
        <link rel="stylesheet" href="/index.css">
      </head>
    `)

  // TODO: minify html
  file_write('./dist/index.html', injected_html)
}

const StaticServer = require('static-server')
const server = new StaticServer({rootPath: './dist', port: 3000, cors: '*', followSymlink: true})

server.on('request',  async (req, res) => await build_dev())
server.start(() => console.log('danta app running on', server.port))

//setInterval(async () => await build_dev(), 1000)
