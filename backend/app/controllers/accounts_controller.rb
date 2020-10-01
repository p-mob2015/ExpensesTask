class AccountsController < ApplicationController
  rescue_from ActiveRecord::RecordInvalid do |error|
    account = error.record
    render json: account.errors, status: :bad_request
  end

  before_action :set_account, only: [:show, :update, :destroy]

  def index
    render json: Account.order(date: :desc)
  end

  def show
    render json: @account.to_json(include: :expenses)
  end

  def create
    account = Account.create!(account_params)
    render json: account
  end

  def update
    @account.update!(account_params)
    render json: @account.to_json(include: :expenses)
  end

  def destroy
    @account.destroy
  end

  private

  def set_account
    @account = Account.find(params[:id])
  end

  def account_params
    params.permit(:name, :number)
  end
end
