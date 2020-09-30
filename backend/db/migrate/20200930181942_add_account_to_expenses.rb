class AddAccountToExpenses < ActiveRecord::Migration[6.0]
  def change
    add_reference :expenses, :account, index: true, foreign_key: true
  end
end
