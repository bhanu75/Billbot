import React, { useState, useEffect } from 'react';
import { Search, Plus, Mic, Camera, Printer, Share2, X, User, Phone, Package, Calculator, IndianRupee, Edit3, Save, Calendar } from 'lucide-react';

// Sample data for testing
const sampleCustomers = [
  { id: 1, name: "Rahul Sharma", phone: "9876543210", email: "rahul@example.com", lastPurchase: "2024-07-15" },
  { id: 2, name: "Priya Singh", phone: "9876543211", email: "priya@example.com", lastPurchase: "2024-07-20" },
  { id: 3, name: "Amit Kumar", phone: "9876543212", email: "amit@example.com", lastPurchase: "2024-07-25" },
  { id: 4, name: "Sunita Devi", phone: "9876543213", email: "sunita@example.com", lastPurchase: "2024-07-28" }
];

const sampleItems = [
  { id: 1, name: "Redmi Note 12 Pro", price: 23999, category: "Mobile", hsn: "85171200", warranty: 12, requiresSerial: true },
  { id: 2, name: "Samsung Galaxy A54", price: 38999, category: "Mobile", hsn: "85171200", warranty: 12, requiresSerial: true },
  { id: 3, name: "Apple iPhone 14", price: 79900, category: "Mobile", hsn: "85171200", warranty: 12, requiresSerial: true },
  { id: 4, name: "OnePlus Nord CE 3", price: 26999, category: "Mobile", hsn: "85171200", warranty: 12, requiresSerial: true },
  { id: 5, name: "Boat Airdopes 141", price: 1499, category: "Earphones", hsn: "85183000", warranty: 6, requiresSerial: false },
  { id: 6, name: "JBL Tune 760NC", price: 4999, category: "Headphones", hsn: "85183000", warranty: 12, requiresSerial: true },
  { id: 7, name: "Apple Watch SE", price: 29900, category: "Smartwatch", hsn: "91021200", warranty: 12, requiresSerial: true },
  { id: 8, name: "Samsung Galaxy Watch 4", price: 23999, category: "Smartwatch", hsn: "91021200", warranty: 12, requiresSerial: true },
  { id: 9, name: "Power Bank 10000mAh", price: 1299, category: "Accessories", hsn: "85076000", warranty: 6, requiresSerial: false },
  { id: 10, name: "Type-C Cable", price: 299, category: "Accessories", hsn: "85444290", warranty: 3, requiresSerial: false }
];

const BillingDashboard = () => {
  const [currentBill, setCurrentBill] = useState({
    customer: null,
    items: [],
    gstEnabled: false,
    gstRate: 18,
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    billNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showItemList, setShowItemList] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);

  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // New item form
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'Mobile',
    hsn: '',
    warranty: 12,
    requiresSerial: false
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = currentBill.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = currentBill.gstEnabled ? (subtotal * currentBill.gstRate) / 100 : 0;
    const total = subtotal + gstAmount;

    setCurrentBill(prev => ({
      ...prev,
      subtotal,
      gstAmount,
      total
    }));
  }, [currentBill.items, currentBill.gstEnabled, currentBill.gstRate]);

  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const filteredItems = sampleItems.filter(item =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const selectCustomer = (customer) => {
    setCurrentBill(prev => ({ ...prev, customer }));
    setCustomerSearch('');
    setShowCustomerList(false);
  };

  const addNewCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Please enter name and phone number');
      return;
    }

    const customer = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      lastPurchase: new Date().toISOString().split('T')[0]
    };

    sampleCustomers.push(customer);
    selectCustomer(customer);
    setNewCustomer({ name: '', phone: '', email: '' });
    setShowAddCustomer(false);
  };

  const addNewItemToList = () => {
    if (!newItem.name || !newItem.price) {
      alert('Please enter item name and price');
      return;
    }

    const item = {
      id: Date.now(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      hsn: newItem.hsn,
      warranty: parseInt(newItem.warranty),
      requiresSerial: newItem.requiresSerial
    };

    sampleItems.push(item);
    addItem(item);
    setNewItem({
      name: '',
      price: '',
      category: 'Mobile',
      hsn: '',
      warranty: 12,
      requiresSerial: false
    });
    setShowAddItem(false);
  };

  const addItem = (item) => {
    const existingItem = currentBill.items.find(billItem => billItem.id === item.id);
    
    if (existingItem) {
      setCurrentBill(prev => ({
        ...prev,
        items: prev.items.map(billItem =>
          billItem.id === item.id
            ? { ...billItem, quantity: billItem.quantity + 1 }
            : billItem
        )
      }));
    } else {
      const warrantyEndDate = new Date();
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + item.warranty);
      
      const newItem = {
        ...item,
        quantity: 1,
        serialNumber: '',
        warrantyDate: warrantyEndDate.toISOString().split('T')[0],
        customWarranty: item.warranty
      };
      setCurrentBill(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }
    
    setItemSearch('');
    setShowItemList(false);
  };

  const updateItemQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      setCurrentBill(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    } else {
      setCurrentBill(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      }));
    }
  };

  const updateItemSerial = (itemId, serialNumber) => {
    setCurrentBill(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, serialNumber } : item
      )
    }));
  };

  const updateItemWarranty = (itemId, months) => {
    const warrantyEndDate = new Date();
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(months));
    
    setCurrentBill(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId 
          ? { 
              ...item, 
              customWarranty: parseInt(months),
              warrantyDate: warrantyEndDate.toISOString().split('T')[0]
            } 
          : item
      )
    }));
  };

  const startVoiceInput = () => {
    setIsVoiceActive(true);
    // Simulate voice recognition
    setTimeout(() => {
      setItemSearch('Redmi Note 12');
      setIsVoiceActive(false);
    }, 2000);
  };

  const generateBill = () => {
    if (!currentBill.customer || currentBill.items.length === 0) {
      alert('Please select customer and add items');
      return;
    }
    setShowBillPreview(true);
  };

  const shareBill = () => {
    const message = `🧾 Bill from Ravi Mobile Store\n\n👤 Customer: ${currentBill.customer.name}\n📱 Phone: ${currentBill.customer.phone}\n💰 Total: ₹${currentBill.total.toFixed(2)}\n📄 Bill No: ${currentBill.billNumber}\n📅 Date: ${new Date().toLocaleDateString('en-IN')}\n\n✨ Thank you for shopping with us!`;
    const whatsappUrl = `https://wa.me/${currentBill.customer.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clearBill = () => {
    setCurrentBill({
      customer: null,
      items: [],
      gstEnabled: false,
      gstRate: 18,
      subtotal: 0,
      gstAmount: 0,
      total: 0,
      billNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
    });
    setShowBillPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">BillPro</h1>
              <p className="text-sm text-gray-600">Ravi Mobile Store</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-mono">{currentBill.billNumber}</p>
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Customer Selection */}
        <div className="bg-white rounded-xl shadow-sm p-4 relative">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <User className="w-4 h-4 mr-2" />
            Customer
          </label>
          
          {currentBill.customer ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-900">{currentBill.customer.name}</p>
                <p className="text-sm text-green-700">{currentBill.customer.phone}</p>
                {currentBill.customer.email && (
                  <p className="text-xs text-green-600">{currentBill.customer.email}</p>
                )}
              </div>
              <button
                onClick={() => setCurrentBill(prev => ({ ...prev, customer: null }))}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer name or phone..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerList(e.target.value.length > 0);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {showCustomerList && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setShowAddCustomer(true);
                      setNewCustomer({ ...newCustomer, name: customerSearch });
                      setShowCustomerList(false);
                    }}
                    className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 border-t border-gray-200"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add new customer
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Item Addition */}
        <div className="bg-white rounded-xl shadow-sm p-4 relative">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Package className="w-4 h-4 mr-2" />
            Add Items
          </label>
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={itemSearch}
                onChange={(e) => {
                  setItemSearch(e.target.value);
                  setShowItemList(e.target.value.length > 0);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={startVoiceInput}
              className={`p-3 rounded-lg border transition-colors ${
                isVoiceActive
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <button className="p-3 bg-gray-50 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          {showItemList && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItem(item)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.category} • HSN: {item.hsn}</p>
                      <p className="text-xs text-gray-500">{item.warranty} months warranty</p>
                    </div>
                    <p className="font-semibold text-green-600">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => setShowAddItem(true)}
                className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 border-t border-gray-200"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add new product
              </button>
            </div>
          )}
        </div>

        {/* Bill Items */}
        {currentBill.items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Bill Items</h3>
            <div className="space-y-4">
              {currentBill.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.price.toLocaleString('en-IN')} each • HSN: {item.hsn}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {item.requiresSerial && (
                    <input
                      type="text"
                      placeholder={item.category === 'Mobile' ? 'IMEI Number' : 'Serial Number'}
                      value={item.serialNumber}
                      onChange={(e) => updateItemSerial(item.id, e.target.value)}
                      className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}

                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Warranty (months)</label>
                      <input
                        type="number"
                        value={item.customWarranty}
                        onChange={(e) => updateItemWarranty(item.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="60"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Warranty till</label>
                      <input
                        type="date"
                        value={item.warrantyDate}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {item.requiresSerial && item.serialNumber && (
                        <span className="block">{item.category === 'Mobile' ? 'IMEI:' : 'S/N:'} {item.serialNumber}</span>
                      )}
                      Warranty: {item.warrantyDate}
                    </p>
                    <p className="font-semibold text-green-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GST Toggle */}
        {currentBill.items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calculator className="w-4 h-4 mr-2" />
                GST
              </label>
              <button
                onClick={() => setCurrentBill(prev => ({ ...prev, gstEnabled: !prev.gstEnabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentBill.gstEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentBill.gstEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {currentBill.gstEnabled && (
              <input
                type="number"
                value={currentBill.gstRate}
                onChange={(e) => setCurrentBill(prev => ({ ...prev, gstRate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="GST Rate (%)"
              />
            )}
          </div>
        )}

        {/* Bill Summary */}
        {currentBill.items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Bill Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{currentBill.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {currentBill.gstEnabled && (
                <div className="flex justify-between">
                  <span className="text-gray-600">GST ({currentBill.gstRate}%):</span>
                  <span className="font-medium">₹{currentBill.gstAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-lg">Total:</span>
                <span className="font-bold text-lg text-green-600 flex items-center">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {currentBill.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {currentBill.items.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={generateBill}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Printer className="w-4 h-4" />
              Generate Bill
            </button>
            <button
              onClick={shareBill}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share WhatsApp
            </button>
          </div>
        )}

        {currentBill.items.length > 0 && (
          <button
            onClick={clearBill}
            className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
          >
            Clear Bill
          </button>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add New Customer</h2>
              <button
                onClick={() => setShowAddCustomer(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name *"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCustomer(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addNewCustomer}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add New Product</h2>
              <button
                onClick={() => setShowAddItem(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name *"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Price *"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Mobile">Mobile</option>
                <option value="Earphones">Earphones</option>
                <option value="Headphones">Headphones</option>
                <option value="Smartwatch">Smartwatch</option>
                <option value="Accessories">Accessories</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="HSN Code"
                value={newItem.hsn}
                onChange={(e) => setNewItem(prev => ({ ...prev, hsn: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Warranty (months)"
                value={newItem.warranty}
                onChange={(e) => setNewItem(prev => ({ ...prev, warranty: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="60"
              />
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newItem.requiresSerial}
                  onChange={(e) => setNewItem(prev => ({ ...prev, requiresSerial: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Requires Serial/IMEI Number</span>
              </label>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddItem(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addNewItemToList}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Bill Preview Modal */}
      {showBillPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Bill Preview</h2>
                <button
                  onClick={() => setShowBillPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Professional Invoice Layout */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                
                {/* Header */}
                <div className="border-b-2 border-gray-900 pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">RAVI MOBILE STORE</h1>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Shop No. 15, Jawahar Nagar Market</p>
                        <p>Jaipur, Rajasthan - 302004</p>
                        <p>Phone: +91 98765 43210</p>
                        <p>Email: ravi@mobilstore.com</p>
                        <p>GSTIN: 08ABCDE1234F1Z5</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4">
                        <p className="text-lg font-bold">INVOICE</p>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><strong>Invoice No:</strong> {currentBill.billNumber}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
                        <p><strong>Time:</strong> {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">BILL TO:</h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-gray-900">{currentBill.customer?.name}</p>
                      <p className="text-gray-600">Phone: {currentBill.customer?.phone}</p>
                      {currentBill.customer?.email && (
                        <p className="text-gray-600">Email: {currentBill.customer.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">PAYMENT INFO:</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Payment Method:</span> Cash</p>
                      <p><span className="font-medium">Due Date:</span> {new Date().toLocaleDateString('en-IN')}</p>
                      <p><span className="font-medium">Status:</span> <span className="text-green-600 font-semibold">PAID</span></p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-bold">ITEM DESCRIPTION</th>
                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-bold">HSN</th>
                        <th className="border border-gray-300 px-4 py-3 text-center text-sm font-bold">QTY</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-bold">RATE</th>
                        <th className="border border-gray-300 px-4 py-3 text-right text-sm font-bold">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBill.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              {item.serialNumber && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {item.category === 'Mobile' ? 'IMEI:' : 'S/N:'} {item.serialNumber}
                                </p>
                              )}
                              <p className="text-xs text-gray-600 mt-1">
                                Warranty: {new Date(item.warrantyDate).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center text-sm">{item.hsn}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">{item.quantity}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm">₹{item.price.toLocaleString('en-IN')}</td>
                          <td className="border border-gray-300 px-4 py-3 text-right text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Subtotal:</span>
                          <span>₹{currentBill.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {currentBill.gstEnabled && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">CGST ({currentBill.gstRate/2}%):</span>
                              <span>₹{(currentBill.gstAmount/2).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">SGST ({currentBill.gstRate/2}%):</span>
                              <span>₹{(currentBill.gstAmount/2).toLocaleString('en-IN')}</span>
                            </div>
                          </>
                        )}
                        <hr className="border-gray-300" />
                        <div className="flex justify-between text-lg font-bold">
                          <span>TOTAL:</span>
                          <span className="text-blue-600">₹{currentBill.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount in Words */}
                <div className="mb-8 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                  <p className="text-sm">
                    <span className="font-bold">Amount in Words: </span>
                    <span className="capitalize">{convertToWords(currentBill.total)} Rupees Only</span>
                  </p>
                </div>

                {/* Terms & Conditions */}
                <div className="border-t border-gray-300 pt-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">TERMS & CONDITIONS:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• All goods sold are subject to our standard terms and conditions</p>
                    <p>• Warranty terms as mentioned above are applicable</p>
                    <p>• No returns or exchanges without original invoice</p>
                    <p>• Physical damage not covered under warranty</p>
                    <p>• All disputes subject to Jaipur jurisdiction only</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-900 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-600">
                      <p>Thank you for shopping with us!</p>
                      <p className="mt-2 font-medium">Generated by BillPro • Visit: www.billpro.in</p>
                    </div>
                    <div className="text-right">
                      <div className="border-t border-gray-400 pt-2 mt-8 w-48">
                        <p className="text-sm font-medium">Authorized Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Printer className="w-5 h-5" />
                  Print Invoice
                </button>
                <button
                  onClick={shareBill}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Share2 className="w-5 h-5" />
                  Share WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to convert number to words (simplified version)
const convertToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  let result = '';
  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const remainder = num % 100;
  
  if (crores > 0) result += convertTens(crores) + ' Crore ';
  if (lakhs > 0) result += convertTens(lakhs) + ' Lakh ';
  if (thousands > 0) result += convertTens(thousands) + ' Thousand ';
  if (hundreds > 0) result += ones[hundreds] + ' Hundred ';
  if (remainder > 0) result += convertTens(remainder);
  
  return result.trim();
  
  function convertTens(n) {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + ones[n % 10] : '');
  }
};

export default BillingDashboard;
