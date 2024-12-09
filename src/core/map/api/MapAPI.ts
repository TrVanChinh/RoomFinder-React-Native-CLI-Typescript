import authorizedRequest from '../../../service/map/api_service/authorizedRequest';
import * as APICONST from './constant';
import API_LIST from './mapData';

class MapApi {
  getGeocoding(lat: number, lng: number): Promise<any> {
    const url = `${API_LIST.Geocoding}${lat},${lng}&api_key=${APICONST.DEFAULT_PREFIX}`;
    return authorizedRequest.get(url);
  }

  getPlacesAutocomplete(body: { search: string }) {
    return authorizedRequest.get(`${API_LIST.PlacesAutocomplete}${APICONST.DEFAULT_PREFIX}&input=${body.search}`);
  }

  getFindText(body: string) {
    return authorizedRequest.get(`${API_LIST.Find_Place_from_text}${APICONST.DEFAULT_PREFIX}&input=${body}`);
  }
}

export default new MapApi();
