export enum UserTypeEnum {
  Admin = "admin",
  Customer = "customer",
}
export enum StatusEnum {
  Active = "Active",
  Inactive = "Inactive",
  Deleted = 'Deleted',
}

export enum PaymentSourceEnum {
  CASH = "CASH",
  JAZZCASH = "JAZZCASH",
  EASYPASA = "EASYPASA",
  BANK = "BANK",
}

export enum AccountTypeEnum {
  Savings = 'Savings',
  Current = 'Current',
  FixedDeposit = 'FixedDeposit',
  Loan = 'Loan',
}

export enum TransactionTypeEnum {
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal',
  Transfer = 'Transfer',
  Payment = 'Payment',
  Expense = 'Expense',
}

export enum LoanTransactionEnum {
  DEBIT = 'Debit',
  CREDIT = 'Credit',
}

export enum TransactionStatusEnum {
  Pending = 'Pending',
  Completed = 'Completed',
  Reversed = 'Reversed',
  Failed = 'Failed'
}

export enum PaymentMethodEnum {
  Cash = 'Cash',
  Cheque = 'Cheque',
  BankTransfer = 'BankTransfer',
  Card = 'Card',
  Online = 'Online',
}

export enum RecurringIntervalEnum {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export enum OrderStatusEnum {
  pending = "pending",
  complete = "complete",
  rejected = "rejected",
}

export enum PaymentStatusEnum {
  pending = "pending",
  complete = "complete",
  rejected = "rejected",
}

export enum LoanTypeEnum {
  money = 'MONEY',
  items = 'ITEMS'
}


export enum ModuleTypeEnum {
  loanTakers = 'loanTakers',
  distributors = 'distributors',
  expenses = 'expenses'
}
