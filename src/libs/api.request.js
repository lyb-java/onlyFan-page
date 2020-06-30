import HttpRequest from '@/libs/axios'
import config from '@/config/url'
const baseUrl = process.env.NODE_ENV === 'development' ? config.host_admin : config.host_pro

const axios = new HttpRequest(baseUrl)

export default axios
