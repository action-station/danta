/*
 * this is a custom file to get a list of files and file related data
 * with the following rules:
 *  - export an async function called get_file_data
 *  - identify any data that is for each file
 *  - return an array of objects with this formats
 *    {name: <filename>, template_name: <mustache file name> data: <file's data>}
 */

export async function get_file_data(data) {
  return data.pages.map((p, i) => ({
    name: i === 0 ? 'index' : p.name,
    template_name: p._template,
    data: p
  }))
}
