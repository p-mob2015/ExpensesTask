class CreateAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :accounts do |t|
      t.integer :balance, default: 1000
      t.string :name, null: false
      t.string :number, null: false

      t.timestamps
    end
  end
end
