import { Logger } from '@nestjs/common';

export default function generateRetailDiscountFormula(retailDiscountNote: string): string {
    Logger.log(
      'generateRetailDiscountFormula::: dto: ' + retailDiscountNote
    );
    // 15% + 10% + 5%
    let expDiscounts = retailDiscountNote.split('+');
    expDiscounts = expDiscounts.map(item => item.trim());

    const formulas = [];
    for (const discount of expDiscounts) {
      if (discount.includes('%')) {
        const discountInHundred = Number(discount.replace('%', ''));
        const payPriceInDecimal = (100 - discountInHundred) / 100;

        formulas.push(`${payPriceInDecimal}`);
      }
    }

    return formulas.join('*');
  }