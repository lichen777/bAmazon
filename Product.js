class Product {
  constructor (itemId, name, department, price, stockQty) {
    this.itemId = itemId
    this.name = name
    this.department = department
    this.price = price
    this.qty = stockQty
  }
  order (orderQty) {
    if (this.qty < orderQty) {
      return console.log('Insufficient quantity!')
    }
    var cost = this.price * orderQty
    console.log('You have ordered ' + orderQty + ' x ' + this.name + '. Total Cost: $' + cost)
    var newQty = this.qty - orderQty
    this.qty = newQty
    return newQty
  }
  refill (addQty) {
    var value = this.price * addQty
    console.log('You have added ' + addQty + ' x ' + this.name + ' to Inventory. Total Resale value: $' + value)
    var newQty = this.qty + addQty
    this.qty = newQty
    return newQty
  }
}

module.exports = Product
