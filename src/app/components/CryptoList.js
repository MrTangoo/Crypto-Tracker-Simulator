"use client";
import CryptoCard from './CryptoCard';

const CryptoList = ({ cryptos, portfolio, handleBuy, handleSell }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {cryptos.map((crypto) => (
                <CryptoCard
                    key={crypto.id}
                    crypto={crypto}
                    portfolio={portfolio}
                    handleBuy={handleBuy}
                    handleSell={handleSell}
                />
            ))}
        </div>
    );
};

export default CryptoList;
