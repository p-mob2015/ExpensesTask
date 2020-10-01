class Account < ApplicationRecord
  has_many :expenses, dependent: :destroy

  validates :balance, :name, :number, presence: true
  validates :balance, numericality: { greater_than: 0, only_integer: true }

  def deduct_balance!(amount)
    update!(balance: balance - amount)
  end

  def add_balance(amount)
    update(balance: balance + amount)
  end
end
