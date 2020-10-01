# frozen_string_literal: true

FactoryBot.define do
  factory :expense do
    account
    amount { 10 }
    date { Faker::Date.backward(days: 14) }
    description { Faker::Food.dish }
  end
end
