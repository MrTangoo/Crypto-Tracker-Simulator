import axios from 'axios';

export const getCryptos = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin,ethereum,ripple,cardano,litecoin'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
        console.error('Détails de l\'erreur:', error);
        return [];
    }
};
