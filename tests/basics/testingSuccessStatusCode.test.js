/**
 * @param {string} récupère le paramètre [url] dans le .env
 */
const url = process.env.URL

const axios = require('axios');

jest.mock('axios')

test('except success status code', async () => {
  const status = 200

  axios.get.mockResolvedValueOnce(status)

  const result = await axios.get(`${url}/test`)

  expect(axios.get).toBeCalledTimes(1)
  expect(axios.get).toHaveBeenCalledWith(`${url}/test`)
  expect(result).toBe(200)
})