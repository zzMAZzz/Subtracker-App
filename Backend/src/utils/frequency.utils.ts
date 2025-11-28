import { Frequency } from '../types/subscription.types';

export class FrequencyNormalizer {
  static toMonthly(price: number, frequency: Frequency): number {
    if (frequency === Frequency.MONTHLY) {
      return price;
    }
    // Si es anual, dividir entre 12
    return price / 12;
  }
}
