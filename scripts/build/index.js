import dotenvJSON from 'dotenv-json'
import {name} from '../../package.json'

export {get_data} from './get_data'
export {get_file_data} from './get_file_data'

export const set_env = async (stage = 'dev') => {
  await dotenvJSON({
    path: `/var/local/${name}_${stage}.json`
  })
}
