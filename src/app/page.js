"use client";
import { useEffect, useState } from 'react';
import { getCryptos } from './api/cryptos';
import CryptoList from './components/CryptoList';
import TransactionHistory from './components/TransactionHistory';
import Navbar from './components/Navbar';

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [portfolio, setPortfolio] = useState({ cryptos: {}, balance: 1000, purchases: {} });  // solde initial de 1000 $ + un objet 'purchases' pour stocker les prix d'achat
  const [transactions, setTransactions] = useState([]);
  const [portfolioHistory, setPortfolioHistory] = useState([]);  // Historique des valeurs du portefeuille
  const [initialPortfolioValue, setInitialPortfolioValue] = useState(null);  // Valeur initiale du portefeuille
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Pour afficher/fermer le modal
  const [modalMessage, setModalMessage] = useState(''); // Message à afficher dans le modal

  const fetchCryptos = async () => {
    setLoading(true);
    const data = await getCryptos();
    setCryptos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCryptos();
    const intervalId = setInterval(fetchCryptos, 45000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Fonction pour gérer les achats
  const handleBuy = (crypto) => {
    const quantity = prompt(`Combien de ${crypto.name} souhaitez-vous acheter ?`);
    if (quantity && !isNaN(quantity) && quantity > 0) {
      const totalCost = crypto.current_price * parseFloat(quantity);
      if (portfolio.balance >= totalCost) {
        const currentBalance = portfolio.cryptos[crypto.id] || 0;
        const newBalance = currentBalance + parseFloat(quantity);
        const newPortfolio = {
          ...portfolio,
          balance: portfolio.balance - totalCost,  // réduire le solde en dollars
          cryptos: { ...portfolio.cryptos, [crypto.id]: newBalance }, // Mise à jour des cryptos dans le portefeuille
          purchases: { ...portfolio.purchases, [crypto.id]: crypto.current_price }, // Enregistrer le prix d'achat
        };
        setPortfolio(newPortfolio);
        setTransactions([...transactions, { type: 'Achat', crypto: crypto.name, quantity, price: crypto.current_price }]);

        if (initialPortfolioValue === null) {
          setInitialPortfolioValue(calculatePortfolioValue());
        }
      } else {
        alert("Solde insuffisant pour acheter cette crypto.");
      }
    }
  };

  const handleSell = (crypto) => {
    const quantity = prompt(`Combien de ${crypto.name} souhaitez-vous vendre ?`);
    if (quantity && !isNaN(quantity) && quantity > 0 && portfolio.cryptos[crypto.id] >= quantity) {
      const currentBalance = portfolio.cryptos[crypto.id];
      const totalRevenue = crypto.current_price * parseFloat(quantity);

      const purchasePrice = portfolio.purchases[crypto.id];
      const totalCost = purchasePrice * parseFloat(quantity); // Coût total de la crypto achetée
      const profitOrLoss = totalRevenue - totalCost; // Calcul du gain ou de la perte

      const newBalance = currentBalance - parseFloat(quantity);
      const newPortfolio = {
        ...portfolio,
        balance: portfolio.balance + totalRevenue,  // ajouter le revenu de la vente
        cryptos: { ...portfolio.cryptos, [crypto.id]: newBalance },
      };

      // Mettre à jour le portefeuille
      setPortfolio(newPortfolio);
      setTransactions([...transactions, {
        type: 'Vente',
        crypto: crypto.name,
        quantity,
        price: crypto.current_price,
        profitOrLoss
      }]);
      setInitialPortfolioValue(calculatePortfolioValue());


      setModalMessage(profitOrLoss > 0
        ? `Vous avez gagné ${profitOrLoss.toFixed(2)}$ sur cette vente.`
        : `Vous avez perdu ${Math.abs(profitOrLoss).toFixed(2)}$ sur cette vente.`);

      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
      }, 5000);
    } else {
      alert("Vous n'avez pas assez de cette crypto dans votre portefeuille.");
    }
  };

  const calculatePortfolioValue = () => {
    let totalValue = portfolio.balance;
    cryptos.forEach((crypto) => {
      const quantity = portfolio.cryptos[crypto.id] || 0;
      totalValue += quantity * crypto.current_price;
    });
    return totalValue;
  };

  const getPortfolioClass = () => {
    if (initialPortfolioValue === null) return '';  // Si la valeur initiale n'est pas encore définie, on n'affiche pas de classe

    const currentPortfolioValue = calculatePortfolioValue();
    if (currentPortfolioValue === initialPortfolioValue) return '';
    return currentPortfolioValue >= initialPortfolioValue ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <div className='flex justify-center text-3xl md:text-4xl font-bold text-center mb-8'>
          <h2 className='pr-2'>Portefeuille: </h2>
          <h2 className={`${getPortfolioClass()}`}>
            ${calculatePortfolioValue().toFixed(2)}
          </h2>
        </div>
        <CryptoList cryptos={cryptos} portfolio={portfolio} handleBuy={handleBuy} handleSell={handleSell} />
        <TransactionHistory transactions={transactions} />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed bottom-10 right-10 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Détails de la transaction</h3>
              <p className="text-lg">{modalMessage}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
