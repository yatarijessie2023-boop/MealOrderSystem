let currentUser = "";

let menu = [
  { id: 1, name: "雞腿便當", price: 120 },
  { id: 2, name: "排骨便當", price: 110 },
  { id: 3, name: "滷肉飯", price: 60 },
  { id: 4, name: "牛肉麵", price: 130 },
  { id: 5, name: "紅茶", price: 30 }
];

let orders = [];

function login() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("loginName").value.trim();

  if (name === "") {
    alert("請輸入姓名或帳號");
    return;
  }

  currentUser = name;
  document.getElementById("loginPage").classList.add("hidden");

  if (role === "user") {
    document.getElementById("userPage").classList.remove("hidden");
    document.getElementById("userName").textContent = name;
    renderViewMenu();
    renderOrderMenu();
  } else {
    document.getElementById("adminPage").classList.remove("hidden");
    document.getElementById("adminName").textContent = name;
    renderAdminMenu();
  }
}

function logout() {
  currentUser = "";
  document.getElementById("loginName").value = "";

  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("userPage").classList.add("hidden");
  document.getElementById("adminPage").classList.add("hidden");
}

function showUserSection(id) {
  document.getElementById("menuSection").classList.add("hidden");
  document.getElementById("orderSection").classList.add("hidden");
  document.getElementById("querySection").classList.add("hidden");

  document.getElementById(id).classList.remove("hidden");

  renderViewMenu();
  renderOrderMenu();
}

function showAdminSection(id) {
  document.getElementById("manageMenuSection").classList.add("hidden");
  document.getElementById("allOrdersSection").classList.add("hidden");
  document.getElementById("statsSection").classList.add("hidden");

  document.getElementById(id).classList.remove("hidden");

  renderAdminMenu();
}

function renderViewMenu() {
  const list = document.getElementById("viewMenuList");
  list.innerHTML = "";

  menu.forEach(item => {
    list.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>NT$ ${item.price}</td>
      </tr>
    `;
  });
}

function renderOrderMenu() {
  const list = document.getElementById("orderMenuList");
  list.innerHTML = "";

  menu.forEach(item => {
    list.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>NT$ ${item.price}</td>
        <td>
          <input 
            type="number" 
            min="0" 
            value="0"
            id="qty-${item.id}"
            oninput="calculateTotal()"
          >
        </td>
        <td id="subtotal-${item.id}">NT$ 0</td>
      </tr>
    `;
  });

  calculateTotal();
}

function calculateTotal() {
  let totalQuantity = 0;
  let totalAmount = 0;

  menu.forEach(item => {
    const qtyInput = document.getElementById(`qty-${item.id}`);
    if (!qtyInput) return;

    const qty = Number(qtyInput.value);
    const subtotal = qty * item.price;

    document.getElementById(`subtotal-${item.id}`).textContent = `NT$ ${subtotal}`;

    totalQuantity += qty;
    totalAmount += subtotal;
  });

  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalAmount").textContent = totalAmount;
}

function submitOrder() {
  let items = [];
  let totalQuantity = 0;
  let totalAmount = 0;

  menu.forEach(item => {
    const qty = Number(document.getElementById(`qty-${item.id}`).value);

    if (qty > 0) {
      const subtotal = qty * item.price;

      items.push({
        name: item.name,
        price: item.price,
        quantity: qty,
        subtotal: subtotal
      });

      totalQuantity += qty;
      totalAmount += subtotal;
    }
  });

  if (items.length === 0) {
    alert("請至少選擇一個餐點");
    return;
  }

  const order = {
    id: orders.length + 1,
    customerName: currentUser,
    items: items,
    totalQuantity: totalQuantity,
    totalAmount: totalAmount,
    time: new Date().toLocaleString()
  };

  orders.push(order);

  alert(`訂單建立成功！訂單編號：${order.id}`);

  clearOrderInput();
}

function clearOrderInput() {
  menu.forEach(item => {
    const qtyInput = document.getElementById(`qty-${item.id}`);
    const subtotal = document.getElementById(`subtotal-${item.id}`);

    if (qtyInput) qtyInput.value = 0;
    if (subtotal) subtotal.textContent = "NT$ 0";
  });

  document.getElementById("totalQuantity").textContent = 0;
  document.getElementById("totalAmount").textContent = 0;
}

function showMyOrders() {
  const result = document.getElementById("myOrderResult");
  result.innerHTML = "";

  const myOrders = orders.filter(order => order.customerName === currentUser);

  if (myOrders.length === 0) {
    result.innerHTML = "<p>目前沒有訂單。</p>";
    return;
  }

  myOrders.forEach(order => {
    result.innerHTML += createOrderHTML(order);
  });
}

function renderAdminMenu() {
  const list = document.getElementById("adminMenuList");
  list.innerHTML = "";

  menu.forEach(item => {
    list.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>NT$ ${item.price}</td>
        <td>
          <button onclick="editMenu(${item.id})">修改</button>
          <button class="delete" onclick="deleteMenu(${item.id})">刪除</button>
        </td>
      </tr>
    `;
  });
}

function addMenu() {
  const name = document.getElementById("newMenuName").value.trim();
  const price = Number(document.getElementById("newMenuPrice").value);

  if (name === "" || price <= 0) {
    alert("請輸入正確的餐點名稱與價格");
    return;
  }

  menu.push({
    id: Date.now(),
    name: name,
    price: price
  });

  document.getElementById("newMenuName").value = "";
  document.getElementById("newMenuPrice").value = "";

  renderAdminMenu();
  renderViewMenu();
  renderOrderMenu();
}

function editMenu(id) {
  const item = menu.find(m => m.id === id);

  const newName = prompt("請輸入新的餐點名稱", item.name);
  const newPrice = prompt("請輸入新的價格", item.price);

  if (newName === null || newPrice === null) return;

  if (newName.trim() === "" || Number(newPrice) <= 0) {
    alert("輸入資料不正確");
    return;
  }

  item.name = newName.trim();
  item.price = Number(newPrice);

  renderAdminMenu();
  renderViewMenu();
  renderOrderMenu();
}

function deleteMenu(id) {
  if (!confirm("確定要刪除此餐點嗎？")) return;

  menu = menu.filter(item => item.id !== id);

  renderAdminMenu();
  renderViewMenu();
  renderOrderMenu();
}

function showAllOrders() {
  const result = document.getElementById("allOrderResult");
  result.innerHTML = "";

  if (orders.length === 0) {
    result.innerHTML = "<p>目前沒有任何訂單。</p>";
    return;
  }

  orders.forEach(order => {
    result.innerHTML += createOrderHTML(order);
  });
}

function createOrderHTML(order) {
  let itemText = "";

  order.items.forEach(item => {
    itemText += `${item.name} × ${item.quantity}，小計 NT$ ${item.subtotal}<br>`;
  });

  return `
    <div class="order-card">
      <p><strong>訂單編號：</strong>${order.id}</p>
      <p><strong>顧客姓名：</strong>${order.customerName}</p>
      <p><strong>訂購時間：</strong>${order.time}</p>
      <p><strong>訂購內容：</strong><br>${itemText}</p>
      <p><strong>總數量：</strong>${order.totalQuantity} 份</p>
      <p><strong>總金額：</strong>NT$ ${order.totalAmount}</p>
    </div>
  `;
}

function showStats() {
  let totalQuantity = 0;
  let totalAmount = 0;

  orders.forEach(order => {
    totalQuantity += order.totalQuantity;
    totalAmount += order.totalAmount;
  });

  document.getElementById("statOrderCount").textContent = orders.length;
  document.getElementById("statTotalQuantity").textContent = totalQuantity;
  document.getElementById("statTotalAmount").textContent = totalAmount;
}