import { Expense } from './Expense';
import { ExpenseCategory } from './ExpenseCategory';
import { User } from './user';
import { Account } from './BankAccounts';

export function setupAssociations() {
    // Expense relationships
    Expense.belongsTo(User, { foreignKey: 'userId' });
    Expense.belongsTo(Account, { foreignKey: 'accountId' });
    Expense.belongsTo(ExpenseCategory, { foreignKey: 'categoryId' });

    // Reverse relationships
    User.hasMany(Expense, { foreignKey: 'userId' });
    Account.hasMany(Expense, { foreignKey: 'accountId' });
    ExpenseCategory.hasMany(Expense, { foreignKey: 'categoryId' });
}
