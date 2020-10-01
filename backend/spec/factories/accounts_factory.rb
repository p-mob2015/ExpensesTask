# frozen_string_literal: true

FactoryBot.define do
  factory :account do
    name { Faker::Name.unique.name }
    number { Faker::Bank.account_number }
  end
end
