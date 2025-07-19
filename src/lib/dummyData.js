import { supabase } from '@/lib/customSupabaseClient';

export const generateDummyData = async (user, toast, transactionsTable, categoriesTable) => {
    const { count, error: countError } = await supabase
        .from(transactionsTable)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    if (countError) {
        toast({ title: 'Error checking data', description: countError.message, variant: 'destructive' });
        return;
    }
    
    if (count > 0) {
        return;
    }

    const { data: existingCategories, error: catError } = await supabase
        .from(categoriesTable)
        .select('id, name, type')
        .eq('user_id', user.id);

    if (catError) {
        toast({ title: 'Error fetching categories', description: catError.message, variant: 'destructive' });
        return;
    }

    const categoriesToInsert = [
        { name: 'Gaji', color: '#22c55e', type: 'income' },
        { name: 'Bonus', color: '#84cc16', type: 'income' },
        { name: 'Makanan & Minuman', color: '#ef4444', type: 'expense' },
        { name: 'Transportasi', color: '#f97316', type: 'expense' },
        { name: 'Tagihan', color: '#06b6d4', type: 'expense' },
        { name: 'Belanja', color: '#ec4899', type: 'expense' },
        { name: 'Hiburan', color: '#8b5cf6', type: 'expense' },
    ];

    const newCategories = categoriesToInsert.filter(c => !existingCategories.some(ec => ec.name === c.name));

    let allCategories = [...existingCategories];

    if (newCategories.length > 0) {
        const { data: insertedCategories, error: insertCatError } = await supabase
            .from(categoriesTable)
            .insert(newCategories.map(c => ({ ...c, user_id: user.id })))
            .select('id, name, type');
        
        if (insertCatError) {
            toast({ title: 'Error adding dummy categories', description: insertCatError.message, variant: 'destructive' });
            return;
        }
        allCategories = [...existingCategories, ...insertedCategories];
    }
    
    const transactionsToInsert = [];
    const descriptions = {
        income: { 'Gaji': ['Gaji Bulanan'], 'Bonus': ['Bonus Proyek'] },
        expense: {
            'Makanan & Minuman': ['Makan siang kantor', 'Kopi pagi', 'Belanja mingguan'],
            'Transportasi': ['Bensin mobil', 'Tiket KRL', 'Parkir'],
            'Tagihan': ['Bayar listrik', 'Tagihan internet', 'Cicilan rumah'],
            'Belanja': ['Baju baru', 'Peralatan elektronik'],
            'Hiburan': ['Tiket bioskop', 'Langganan Netflix']
        }
    };

    const months = [5, 6]; // Juni, Juli (0-indexed)
    const year = new Date().getFullYear();

    for (const month of months) {
        for (let day = 1; day <= 28; day++) {
            if (Math.random() > 0.4) continue;

            const category = allCategories[Math.floor(Math.random() * allCategories.length)];
            const catDescriptions = descriptions[category.type]?.[category.name];
            if (!catDescriptions) continue;

            transactionsToInsert.push({
                user_id: user.id,
                category_id: category.id,
                type: category.type,
                amount: Math.floor(Math.random() * (category.type === 'income' ? 2000000 : 200000)) + 50000,
                description: catDescriptions[Math.floor(Math.random() * catDescriptions.length)],
                date: new Date(year, month, day).toISOString(),
            });
        }
    }
    
    if (transactionsToInsert.length === 0) return;

    const { error: insertTransError } = await supabase.from(transactionsTable).insert(transactionsToInsert);

    if (insertTransError) {
        toast({ title: 'Error adding dummy transactions', description: insertTransError.message, variant: 'destructive' });
    } else {
        toast({ title: 'Success', description: `Dummy data for ${transactionsTable} has been generated.` });
    }
};