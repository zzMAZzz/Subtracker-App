import { Currency } from '../types/subscription.types';

export class CurrencyConverter {
  private static USD_TO_HNL_RATE = parseFloat(process.env.USD_TO_HNL_RATE || '26');

  static toHNL(amount: number, currency: Currency): number {
    if (currency === Currency.HNL) {
      return amount;
    }
    return amount * this.USD_TO_HNL_RATE;
  }

  static toUSD(amount: number, currency: Currency): number {
    if (currency === Currency.USD) {
      return amount;
    }
    return amount / this.USD_TO_HNL_RATE;
  }
}
