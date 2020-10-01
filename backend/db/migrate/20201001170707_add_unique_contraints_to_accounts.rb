class AddUniqueContraintsToAccounts < ActiveRecord::Migration[6.0]
  def change
    add_index :accounts, :name, unique: true
    add_index :accounts, :number, unique: true
  end
end
