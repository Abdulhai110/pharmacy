interface LedgerEntry {
    id: string;
    date: Date | null;
    type: string;
    entityId?: number;
    entityName?: string;
    phone?: string;
    company?: string;
    debitAmount?: number;
    creditAmount?: number;
    amount?: number | null;
    gstAmount?: number | null;
    advTaxAmount?: number | null;
    description: string;
    runningBalance?: number;
    billNo?: string;
    paymentSourceId?: number;
    category?: string;
    paymentMethod?: string;
}

interface OpeningBalance {
    name: string;
    phoneNumber?: string;
    companyName?: string;
    openingBalance: number;
}

interface LedgerRequest {
    moduleType: 'loanTakers' | 'distributors' | 'expenses';
    startDate: Date;
    endDate: Date;
    entityId?: number;
    gst: boolean;
    advTax: boolean;
    generatePdf: boolean;
}

interface AggregationResult {
    loanTakerId?: number;
    distributorId?: number;
    total: number;
}