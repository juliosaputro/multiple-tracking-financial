import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useData } from "@/contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShimmerCard from "@/components/ShimmerCard";

const Dashboard = () => {
  const {
    transactions,
    formatCurrency,
    formatDate,
    getFilteredData,
    loading,
    walletId,
  } = useData();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const {
    transactions: filteredTransactionsForMonth,
    income,
    expense,
    balance,
    monthlyChartData,
    categoryExpenses,
  } = useMemo(
    () => getFilteredData(selectedYear, selectedMonth),
    [getFilteredData, selectedYear, selectedMonth]
  );

  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [transactions]);

  const walletNames = {
    dompetku: "Dompetku",
    kulinerku: "Kulinerku",
    "es-mambo": "Es Mambo",
  };

  const summaryCards = [
    {
      title: "Total Saldo",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-green-600" : "text-red-600",
      bgColor:
        balance >= 0
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200",
    },
    {
      title: "Total Pemasukan",
      value: income,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
    },
    {
      title: "Total Pengeluaran",
      value: expense,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
    },
  ];

  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(transactions.map((t) => new Date(t.date).getFullYear())),
    ];
    return uniqueYears.length > 0
      ? uniqueYears.sort((a, b) => b - a)
      : [currentYear];
  }, [transactions, currentYear]);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
    "Semua Bulan",
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - {walletNames[walletId]}</title>
        <meta
          name="description"
          content={`Dashboard utama untuk ${walletNames[walletId]}`}
        />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">
              {walletNames[walletId]}
            </h1>
            <p className="text-gray-500">Ringkasan keuangan Anda</p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedMonth === "" ? "12" : selectedMonth.toString()}
              onValueChange={(v) => {
                v === "12" ? setSelectedMonth("") : setSelectedMonth(Number(v));
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [...Array(3)].map((_, i) => (
                <ShimmerCard key={i} className="h-32" />
              ))
            : summaryCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={card.bgColor}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            {card.title}
                          </p>
                          <p className={`text-2xl font-bold ${card.color}`}>
                            {formatCurrency(card.value)}
                          </p>
                        </div>
                        <div
                          className={`p-3 rounded-xl bg-white ${card.color}`}
                        >
                          <card.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  {selectedMonth === ""
                    ? `Transaksi Tahun ${selectedYear}`
                    : `Transaksi Bulan Ini`}
                </CardTitle>
                <CardDescription>
                  {selectedMonth === ""
                    ? "Grafik pemasukan dan pengeluaran bulanan"
                    : "Grafik pemasukan dan pengeluaran harian"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loading ? (
                    <ShimmerCard className="h-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyChartData}>
                        <defs>
                          <linearGradient
                            id="incomeGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#22c55e"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#22c55e"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="expenseGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#ef4444"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ef4444"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          tickFormatter={(value) =>
                            `${(value / 1000000).toFixed(1)}Jt`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                          }}
                          formatter={(value) => [formatCurrency(value), ""]}
                          labelFormatter={(label) =>
                            selectedMonth === ""
                              ? `Bulan ${label}`
                              : `Tanggal ${label}`
                          }
                        />
                        <Area
                          type="monotone"
                          dataKey="income"
                          stroke="#22c55e"
                          fillOpacity={1}
                          fill="url(#incomeGradient)"
                          name="Pemasukan"
                        />
                        <Area
                          type="monotone"
                          dataKey="expense"
                          stroke="#ef4444"
                          fillOpacity={1}
                          fill="url(#expenseGradient)"
                          name="Pengeluaran"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Pengeluaran per Kategori
                </CardTitle>
                <CardDescription>
                  {selectedMonth === ""
                    ? `Distribusi pengeluaran tahun ${selectedYear}`
                    : "Distribusi pengeluaran bulan ini"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {loading ? (
                    <ShimmerCard className="h-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryExpenses}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={5}
                          label={({ name, percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {categoryExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                          }}
                          formatter={(value, name) => [
                            formatCurrency(value),
                            name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Transaksi Terbaru</CardTitle>
              <CardDescription>
                Daftar 10 transaksi terbaru dari semua saku
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="shimmer h-12 rounded-lg"></div>
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada transaksi</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: transaction.categoryColor,
                              }}
                            />
                            <span>{transaction.categoryName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.description}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
