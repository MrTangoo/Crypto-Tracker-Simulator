"use client";
import { useEffect, useState } from 'react';
import { getCryptos } from './api/cryptos';
import CryptoList from './components/CryptoList';
import TransactionHistory from './components/TransactionHistory';

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [portfolio, setPortfolio] = useState({ cryptos: {}, balance: 1000 });  // solde initial de 1000 $
  const [transactions, setTransactions] = useState([]);
  const [portfolioHistory, setPortfolioHistory] = useState([]);  // Historique des valeurs du portefeuille
  const [initialPortfolioValue, setInitialPortfolioValue] = useState(null);  // Valeur initiale du portefeuille
  const [loading, setLoading] = useState(false);

  // Fonction pour récupérer les cryptos depuis l'API
  const fetchCryptos = async () => {
    setLoading(true);
    const data = await getCryptos();
    setCryptos(data);
    setLoading(false);
  };

  // Récupère les données de cryptos au démarrage
  useEffect(() => {
    fetchCryptos();
    // Rafraîchit les prix toutes les 30 secondes
    const intervalId = setInterval(fetchCryptos, 50000);

    // Nettoyage des intervalles lors de la destruction du composant
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
        };
        setPortfolio(newPortfolio);  // Met à jour le portefeuille avec le nouveau solde et la nouvelle quantité de crypto
        setTransactions([...transactions, { type: 'Achat', crypto: crypto.name, quantity, price: crypto.current_price }]);

        // Enregistrer la valeur initiale du portefeuille lors du premier achat
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
      const newBalance = currentBalance - parseFloat(quantity);
      const newPortfolio = {
        ...portfolio,
        balance: portfolio.balance + totalRevenue,  // ajouter le revenu de la vente
        cryptos: { ...portfolio.cryptos, [crypto.id]: newBalance },
      };
      setPortfolio(newPortfolio);  // Met à jour le portefeuille
      setTransactions([...transactions, { type: 'Vente', crypto: crypto.name, quantity, price: crypto.current_price }]);
    } else {
      alert("Vous n'avez pas assez de cette crypto dans votre portefeuille.");
    }
  };

  // Fonction pour calculer la valeur du portefeuille
  const calculatePortfolioValue = () => {
    let totalValue = portfolio.balance;  // Commence par le solde en dollars
    cryptos.forEach((crypto) => {
      const quantity = portfolio.cryptos[crypto.id] || 0;
      totalValue += quantity * crypto.current_price;  // Ajouter la valeur des cryptos dans le portefeuille
    });
    return totalValue;
  };

  // Fonction pour déterminer si on est en gain ou en perte
  const getPortfolioClass = () => {
    if (initialPortfolioValue === null) return '';  // Si la valeur initiale n'est pas encore définie, on n'affiche pas de classe

    const currentPortfolioValue = calculatePortfolioValue();
    return currentPortfolioValue >= initialPortfolioValue ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-center text-blue-600 mb-8">Simulateur d'Investissement en Cryptomonnaies</h1>

        <h2 className={`text-2xl font-medium text-center mb-8 ${getPortfolioClass()}`}>
          Portefeuille actuel : ${calculatePortfolioValue().toFixed(2)}
        </h2>

        <CryptoList cryptos={cryptos} portfolio={portfolio} handleBuy={handleBuy} handleSell={handleSell} />
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}
