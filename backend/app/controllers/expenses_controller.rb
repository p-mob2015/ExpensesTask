class ExpensesController < ApplicationController
  rescue_from ActiveRecord::RecordInvalid do |error|
    expense = error.record
    render json: expense.errors, status: :bad_request
  end

  before_action :set_expense, only: [:show, :update, :destroy]

  def index
    render json: Expense.order(date: :desc)
  end

  def show
    render json: @expense
  end

  def create
    expense = Expense.create!(expense_params)
    render json: expense
  end

  def update
    @expense.update!(expense_params)
    render json: @expense
  end

  def destroy
    @expense.destroy
  end

  private

  def set_expense
    @expense = Expense.find(params[:id])
  end

  def expense_params
    params.permit(:amount, :date, :description, :account_id)
  end
end