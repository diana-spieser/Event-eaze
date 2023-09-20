import { MAPBOX_API_KEY } from '../external-api-constants';

const accessToken = MAPBOX_API_KEY;

export const fetchAddressSuggestions = (query) => {

  if (!query) {
    return Promise.resolve({
      suggestions: [],
      latitude: 0,
      longitude: 0,
    });
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${accessToken}&types=address`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Unable to fetch address suggestions');
      }
      return response.json();
    })
    .then((data) => {
      const suggestions = data.features.map((feature) => feature.place_name);
      const firstFeature = data.features[0];
      const latitude = firstFeature.center[1];
      const longitude = firstFeature.center[0];

      return { suggestions, latitude, longitude };
    })
    .catch((error) => {
      throw error;
    });
};
