# Bond Valuation & Yield to Maturity

Understanding how to properly value bonds is essential for making informed investment decisions. While bonds may seem straightforward, calculating their true return involves more nuance than many investors realize. Let's explore the different methods for valuing bonds and why yield to maturity is the most comprehensive measure.

## Simple Interest vs. Compound Interest

Bonds can be evaluated using either simple interest or compound interest approaches, with significant differences in the results.

### Simple Interest Approach

Under simple interest, we assume that interest payments (coupons) are not reinvested. Let's use an example of a 30-year, $1,000 bond with a 5% coupon rate:

- Each coupon payment: $25 (semi-annual)
- Total number of coupons: 60 (over 30 years)
- Total interest: $1,500 ($25 × 60)

Simple interest only considers the face value of the coupons without accounting for reinvestment of those payments.

![Simple Interest](/images/learn/bond-simple-interest.svg)

### Compound Interest Approach

Under compound interest, we assume that each coupon payment is reinvested at the same rate as the bond's coupon. Using the same example:

- First coupon payment: $25
- This $25 is reinvested at 5% while waiting for future coupons
- After 30 years (60 coupons), the total accumulated value would be approximately $3,400

This dramatic difference ($3,400 vs. $1,500) demonstrates the power of compound interest over long time periods.

![Compound Interest](/images/learn/bond-compound-interest.svg)

## Types of Bond Yields

When evaluating bonds, investors use several different yield calculations, each with different purposes and limitations.

### 1. Coupon Yield

The coupon yield is the simplest measure:

Coupon Yield = Annual Coupon Payment ÷ Par Value

For our example:
- Annual coupon payment: $50
- Par value: $1,000
- Coupon yield: 5% ($50 ÷ $1,000)

Coupon yield only tells you what the bond promises to pay based on its face value. It doesn't account for:
- The actual price you paid for the bond
- The time value of money
- Any premium or discount to par value

### 2. Current Yield

Current yield accounts for the actual price you pay for the bond:

Current Yield = Annual Coupon Payment ÷ Market Price

Let's look at three scenarios where the bond's market price varies:

**Scenario 1: Bond priced at premium ($1,200)**
- Current yield: 4.2% ($50 ÷ $1,200)

**Scenario 2: Bond priced at par ($1,000)**
- Current yield: 5.0% ($50 ÷ $1,000)

**Scenario 3: Bond priced at discount ($800)**
- Current yield: 6.3% ($50 ÷ $800)

![Current Yield](/images/learn/bond-current-yield.svg)

While current yield provides a more accurate picture than coupon yield, it still has a significant limitation: it doesn't account for the gain or loss you'll experience when the bond matures at par value.

### 3. Yield to Maturity (YTM)

Yield to maturity is the most comprehensive measure of a bond's return. It accounts for:
- Coupon payments
- Reinvestment of those payments
- The time value of money
- Any premium or discount to par value

YTM represents the total return you can expect if you hold the bond until maturity and reinvest all coupons at the YTM rate.

## Calculating Yield to Maturity

Let's analyze a bond with 15 years remaining until maturity and a 5% coupon rate, examining three different purchase prices:

**Scenario 1: Bond priced at premium ($1,200)**
- Coupon payments (compounded): $1,098
- Par value loss: -$200 (paid $1,200, receive $1,000 at maturity)
- Net gain: $898
- Yield to maturity: 3.3%

**Scenario 2: Bond priced at par ($1,000)**
- Coupon payments (compounded): $1,098
- Par value gain/loss: $0
- Net gain: $1,098
- Yield to maturity: 5.0%

**Scenario 3: Bond priced at discount ($800)**
- Coupon payments (compounded): $1,098
- Par value gain: $200 (paid $800, receive $1,000 at maturity)
- Net gain: $1,298
- Yield to maturity: 7.2%

![Yield to Maturity](/images/learn/bond-ytm-comparison.svg)

Notice how YTM differs significantly from current yield, especially for bonds trading at a premium or discount:

| Purchase Price | Coupon Yield | Current Yield | Yield to Maturity |
|----------------|--------------|---------------|-------------------|
| $1,200 (Premium) | 5.0% | 4.2% | 3.3% |
| $1,000 (Par) | 5.0% | 5.0% | 5.0% |
| $800 (Discount) | 5.0% | 6.3% | 7.2% |

## The YTM Formula

The yield to maturity is calculated using this formula:

![YTM Formula](/images/learn/bond-ytm-formula.svg)

Where:
- P = current bond price
- C = coupon payment
- F = face value
- n = number of payments
- i = interest rate per period

Solving for `i` gives you the yield to maturity. Due to the complexity of this equation, most investors use financial calculators or spreadsheet functions to determine YTM.

## Practical Applications for Investors

Understanding bond valuation and yield to maturity has several practical applications:

### 1. Comparing Different Bonds

YTM provides a standardized way to compare bonds with:
- Different coupon rates
- Different maturities
- Different prices relative to par

### 2. Assessing Relative Value

By comparing a bond's YTM to those of similar-risk alternatives (like Treasuries), you can determine if it offers appropriate compensation for its risk level.

### 3. Building Bond Ladders

Understanding how bonds behave at different prices helps investors construct bond ladders with appropriate yields across different maturity dates.

### 4. Making Buy/Sell Decisions

- If a bond's YTM is below what you require as a return, it may be overpriced
- If the YTM exceeds your required return, it may represent good value

### 5. Managing Interest Rate Risk

Understanding the relationship between bond prices and yields helps investors position their portfolios appropriately based on interest rate expectations.

## Key Insights for Bond Investors

1. **Look beyond the coupon rate** - The stated coupon can be misleading if you're buying at a premium or discount
2. **Always calculate YTM** - It's the most accurate measure of what you'll actually earn
3. **Consider reinvestment risk** - YTM assumes you can reinvest coupons at the YTM rate, which may not always be possible
4. **Remember tax implications** - Bonds purchased at a discount face different tax treatment than those bought at par or premium
5. **Compare similar-term bonds** - When comparing YTMs, ensure you're comparing bonds with similar maturities

By mastering these concepts, investors can make more informed decisions about bond investments and better understand their true return potential.