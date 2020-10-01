# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Expense, type: :model do
  describe '#create' do
    let!(:account) { create :account }

    context 'when valid amount is given' do
      let!(:expense) { create :expense, account: account, amount: Faker::Number.between(from: 1, to: 999) }

      it 'deduces account balance' do
        expect(account.balance).to eq(1000 - expense.amount)
      end
    end

    context 'when amount bigger than balance is given' do
      let!(:expense) { build :expense, account: account, amount: Faker::Number.between(from: 1001, to: 9999) }

      it 'raises validation error' do
        expense.save
        expect(expense.errors[:account]).to be_present
      end
    end
  end

  describe '#delete' do
    let!(:account) { create :account }
    let!(:expense) { create :expense, account: account, amount: Faker::Number.between(from: 1, to: 999) }

    it 'restores account balance' do
      expect(account.balance).to be < 1000

      expense.destroy
      expect(account.balance).to eq(1000)
    end
  end

  describe '#update' do
    let!(:account_alpha) { create :account }
    let!(:account_beta) { create :account }

    context 'amount is changed' do
      let!(:expense) { create :expense, account: account_alpha, amount: Faker::Number.between(from: 1, to: 999) }

      context 'when amount is changed to valid amount' do
        it 'updates account balance correctly' do
          new_amount = Faker::Number.between(from: 1, to: 999)
          expense.update(amount: new_amount)

          expect(account_alpha.balance).to eq(1000 - new_amount)
        end
      end

      context 'when amount is changed to invalid amount' do
        it 'raises validation error and doesnt update anything' do
          original_balance = account_alpha.balance
          new_amount = Faker::Number.between(from: 1001, to: 9999)
          expense.update(amount: new_amount)

          expect(expense.errors[:account]).to be_present
          expect(account_alpha.reload.balance).to eq(original_balance)
        end
      end
    end

    context 'account is changed' do
      let!(:expense) { create :expense, account: account_alpha, amount: Faker::Number.between(from: 10, to: 999) }

      context 'when switched to an account with sufficient balance' do
        it 'updates accounts balances correctly' do
          expense.update(account: account_beta)

          expect(account_beta.balance).to eq(1000 - expense.amount)
          expect(account_alpha.reload.balance).to eq(1000)
        end
      end

      context 'when switched to an account with insufficient balance' do
        before do
          account_beta.update(balance: expense.amount-5)
        end

        it 'raises validation error and doesnt update anything' do
          expense.update(account: account_beta)

          expect(expense.errors[:account]).to be_present
          expect(account_beta.reload.balance).to eq(expense.amount-5)
        end
      end
    end

    context 'amount and account are both changed' do
      let!(:original_amount) { Faker::Number.between(from: 1, to: 999) }
      let!(:expense) { create :expense, account: account_alpha, amount: original_amount }

      context 'when switched to account with sufficient balance for new amount' do
        it 'updates accounts balances correctly' do
          new_amount = Faker::Number.between(from: 1, to: 999)
          expense.update(amount: new_amount, account: account_beta)

          expense.reload
          expect(expense.amount).to eq(new_amount)
          expect(expense.account_id).to eq(account_beta.id)
          expect(account_beta.reload.balance).to eq(1000 - new_amount)
          expect(account_alpha.reload.balance).to eq(1000)
        end
      end

      context 'when switched to account with insufficient balance for new amount' do
        it 'raises validation error and updates nothing' do
          new_amount = Faker::Number.between(from: 1001, to: 2000)
          expense.update(amount: new_amount, account: account_beta)

          expect(expense.errors[:account]).to be_present

          expense.reload
          expect(expense.amount).to eq(original_amount)
          expect(expense.account_id).to eq(account_alpha.id)
          expect(account_beta.reload.balance).to eq(1000)
          expect(account_alpha.reload.balance).to eq(1000-original_amount)
        end
      end
    end
  end
end
