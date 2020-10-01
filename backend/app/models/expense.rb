class Expense < ApplicationRecord
  before_save :update_account_balance!
  after_destroy :restore_account_balance

  belongs_to :account

  validates :amount, :date, :description, presence: true
  validates :amount, numericality: { greater_than: 0, only_integer: true }

  private

  def update_account_balance!
    return unless amount_changed? || account_id_changed?

    previous_amount = amount_changed? ? changes['amount'].first : amount

    if account_id_changed?
      account.deduct_balance!(amount)

      previous_account = Account.find_by_id changes['account_id'].first
      previous_account.add_balance(previous_amount) if previous_account.present?
    else
      account.deduct_balance!(amount-previous_amount)
    end
  rescue ActiveRecord::RecordInvalid
    errors.add(:account, "balance is insufficient: $#{account.balance_in_database}")
    raise ActiveRecord::RecordInvalid.new(self)
  end

  def restore_account_balance
    unless destroyed_by_association
      account.add_balance(amount)
    end
  end
end
