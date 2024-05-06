
import axios from 'axios';

export default axios.create({
  baseURL: `https://qa-cgo.centralonbus.com.br/api/`,
  timeout: 15000,
  headers: {'Authorization': 'foobar'}
});
