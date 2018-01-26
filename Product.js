class Product {
  constructor(itemId, name, department, price, stockQty) {
    this.itemId = itemId;
    this.name = name;
    this.department = department;
    this.price = price;
    this.qty = stockQty;
  }
  order(orderQty) {
    if(this.qty < orderQty) {
      return console.log("Insufficient quantity!");
    }
    var cost = this.price * orderQty;
    console.log("You have ordered " + this.name + ". Total Cost: " + cost);
    var newQty = this.qty - orderQty;
    return newQty;
  }
}

module.exports = Product;