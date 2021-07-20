import { Client, PlacesNearbyRequest } from '@googlemaps/google-maps-services-js';
import { PlacesNearbyRanking } from '@googlemaps/google-maps-services-js/dist/places/placesnearby';

const manchesterLatLng = { lat: 53.483959, lng: -2.244644 };

const getPlacesToEat = async () => {
    try {
        const gClient = new Client({});
        const placesRequest: PlacesNearbyRequest = {
            params: {
                key: process.env.GOOGLE_MAPS_API_KEY ?? '',
                location: manchesterLatLng,
                rankby: PlacesNearbyRanking.distance,
                type: 'meal_takeaway',
                opennow: true,
                maxprice: 3,
            },
        };
        const {
            data: { results },
        } = await gClient.placesNearby(placesRequest);
        return results;
    } catch (e) {
        return [];
    }
};

export const getPlaceToEat = async () => {
    const places = await getPlacesToEat();
    const index = Math.floor(Math.random() * places.length);
    return places[index].name ?? 'Subway';
};
