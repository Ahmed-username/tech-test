describe("calculations.js", function() {
  let currencies;
  beforeAll(function() {
    currencies = {
      AED: 4.828081,
      AFN: 99.741889,
      ANG: 2.333461
    };
  });
  it("converts a currency from a currency to another", function() {
    expect(convertFrom(2, "AED", "AFN", currencies)).toBe(41.3174);
    expect(convertFrom(3, "AFN", "ANG", currencies)).toBe(0.0702);
  });

  it("converts a currency back", function() {
    expect(convertTo(2, "AED", "AFN", currencies)).toBe(0.0968);
    expect(convertTo(5, "AFN", "ANG", currencies)).toBe(213.7209);
  });
});
