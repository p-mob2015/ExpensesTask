class Account < ApplicationRecord
  has_many :expenses

  validates :balance, :name, :number, presence: true
  validates :balance, numericality: { greater_than: 0, only_integer: true }
end
