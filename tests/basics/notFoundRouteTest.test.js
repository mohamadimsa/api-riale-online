/**
 * @param {string} récupère le paramètre [url] dans le .env
 */
const url = process.env.URL

const axios = require('axios');

jest.mock('axios')

test('except not found exception', async () => {
    const status = 404

    axios.get.mockResolvedValueOnce(status)

    const result = await axios.get(`${url}/test-not-found`)

    expect(axios.get).toBeCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(`${url}/test-not-found`)
    expect(result).toBe(404)
})