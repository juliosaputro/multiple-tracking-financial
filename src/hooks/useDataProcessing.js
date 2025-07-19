import { useCallback } from 'react';

export const useDataProcessing = (transactions) => {
  const getFilteredData = useCallback((year, month) => {
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const balance = income - expense;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyDataMap = new Map();

    for (let i = 1; i <= daysInMonth; i++) {
        dailyDataMap.set(i, { day: i, income: 0, expense: 0 });
    }

    filteredTransactions.forEach(t => {
        const day = new Date(t.date).getDate();
        const data = dailyDataMap.get(day);
        if (data) {
            data[t.type] += Number(t.amount);
        }
    });

    const monthlyChartData = Array.from(dailyDataMap.values());

    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenseTransactions.forEach(t => {
      if (!categoryTotals[t.categoryName]) {
        categoryTotals[t.categoryName] = {
          name: t.categoryName,
          value: 0,
          color: t.categoryColor
        };
      }
      categoryTotals[t.categoryName].value += Number(t.amount);
    });
    
    const categoryExpenses = Object.values(categoryTotals);
    
    return {
        transactions: filteredTransactions,
        income,
        expense,
        balance,
        monthlyChartData,
        categoryExpenses,
    };
  }, [transactions]);

  return { getFilteredData };
};