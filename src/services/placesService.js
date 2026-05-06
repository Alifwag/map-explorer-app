import axios from 'axios';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export const placesService = {
  searchPlaces: async (query, category = null) => {
    try {
      const response = await axios.get(`${NOMINATIM_API}/search`, {
        params: {
          q: category ? `${query} ${category}` : query,
          format: 'json',
          addressdetails: 1,
          limit: 20
        }
      });
      
      return response.data.map(place => ({
        id: place.place_id,
        name: place.display_name.split(',')[0],
        fullAddress: place.display_name,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        type: place.type,
        category: place.category,
        rating: Math.random() * 5,
        reviews: Math.floor(Math.random() * 500)
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  },

  getPlaceDetails: async (placeId) => {
    try {
      const response = await axios.get(`${NOMINATIM_API}/details`, {
        params: {
          place_id: placeId,
          format: 'json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }
};