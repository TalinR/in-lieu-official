import clsx from 'clsx';

type PriceProps = {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
  showSymbol?: boolean; // when false, formats as decimal without currency symbol
  fractionDigits?: number; // force a specific number of fraction digits
} & React.ComponentProps<'p'>;

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  currencyCodeClassName,
  showSymbol = true,
  fractionDigits
}: PriceProps) => {
  const numericAmount = Number(amount);

  const formatter = new Intl.NumberFormat(undefined, {
    ...(showSymbol
      ? {
          style: 'currency' as const,
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol'
        }
      : { style: 'decimal' as const }),
    ...(fractionDigits !== undefined
      ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
      : {})
  });

  const formatted = formatter.format(numericAmount);

  return (
    <p suppressHydrationWarning={true} className={className}>
      {formatted}
      <span className={clsx('ml-1 inline', currencyCodeClassName)}>{currencyCode}</span>
    </p>
  );
};

export default Price;
