// components/TransactionHistory.js
import React from 'react';

const TransactionHistory = ({ transactions }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Historique des transactions</h2>
            <div className="max-h-96 overflow-y-auto"> {/* Limite la hauteur et ajoute la scrollbar si nécessaire */}
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Crypto</th>
                            <th className="px-4 py-2 text-left">Quantité</th>
                            <th className="px-4 py-2 text-left">Prix</th>
                            <th className="px-4 py-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{transaction.type}</td>
                                <td className="px-4 py-2">{transaction.crypto}</td>
                                <td className="px-4 py-2">{transaction.quantity}</td>
                                <td className="px-4 py-2">${transaction.price}</td>
                                <td className="px-4 py-2">{new Date().toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default TransactionHistory;
