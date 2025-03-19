
const CryptoCard = ({ crypto, portfolio, handleBuy, handleSell }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 my-4 max-w-xs mx-auto">
            <h3 className="text-xl font-semibold text-center mb-4">{crypto.name}</h3>
            <p className="text-lg text-gray-700 mb-2">Prix actuel : ${crypto.current_price}</p>
            <p className="text-md text-gray-500 mb-4">Votre solde : {portfolio.cryptos[crypto.id] || 0} {crypto.symbol.toUpperCase()}</p>
            <div className="flex justify-between gap-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={() => handleBuy(crypto)}>
                    Acheter
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    onClick={() => handleSell(crypto)}>
                    Vendre
                </button>
            </div>
        </div>
    );
};

export default CryptoCard;
