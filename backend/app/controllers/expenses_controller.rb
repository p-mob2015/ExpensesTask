class ExpensesController < ApplicationController
  rescue_from ActiveRecord::RecordInvalid do |error|
    expense = error.record
    render json: expense.errors, status: :bad_request
  end

  def index
    render json: Expense.order(date: :desc)
  end

  def show
    expense = Expense.find(params[:id])
    render json: expense
  end

  def create
    expense = Expense.create!(expense_params)
    render json: expense
  end

  def update
    expense = Expense.find(params[:id])
    expense.update!(expense_params)
    render json: expense
  end

  def destroy
    expense = Expense.find(params[:id])
    expense.destroy
  end

  private

  def expense_params
    params.permit(:amount, :date, :description)
  end
end