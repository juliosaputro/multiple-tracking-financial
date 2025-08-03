import { useCallback } from 'react';

export const useDataProcessing = (transactions) => {
  const getFilteredData = useCallback((year, month) => {

    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const yearMatch = transactionDate.getFullYear() === year;
      const monthMatch = month === "" || transactionDate.getMonth() === month;
      return yearMatch && monthMatch;
    });


    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const balance = income - expense;

    let monthlyChartData = [];

    // Logika adaptif untuk data grafik
    if (month !== "") {
      // KASUS 1: Satu bulan dipilih -> Tampilkan data harian
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
      monthlyChartData = Array.from(dailyDataMap.values());
    } else {
      // KASUS 2: "Semua Bulan" dipilih -> Tampilkan data bulanan
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const monthlyDataMap = new Map();

      // Inisialisasi data untuk 12 bulan
      for (let i = 0; i < 12; i++) {
        // Kita tetap menggunakan properti 'day' agar kompatibel dengan komponen Chart
        monthlyDataMap.set(i, { day: monthNames[i], income: 0, expense: 0 });
      }

      filteredTransactions.forEach(t => {
        const transactionMonth = new Date(t.date).getMonth();
        const data = monthlyDataMap.get(transactionMonth);
        if (data) {
          data[t.type] += Number(t.amount);
        }
      });
      monthlyChartData = Array.from(monthlyDataMap.values());
    }

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