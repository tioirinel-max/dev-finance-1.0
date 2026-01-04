let transactions = JSON.parse(localStorage.getItem('dev.finances:premium')) || [];

// Configuração do Gráfico Principal
const ctx = document.getElementById('mainChart').getContext('2d');
let mainChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Entradas', 'Saídas'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#00f298', '#f02d4e'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '80%'
    }
});

function updateDashboard() {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const total = income - expense;

    document.getElementById('incomeDisplay').innerText = `R$ ${income.toLocaleString('pt-BR')}`;
    document.getElementById('expenseDisplay').innerText = `R$ ${expense.toLocaleString('pt-BR')}`;
    document.getElementById('totalDisplay').innerText = `R$ ${total.toLocaleString('pt-BR')}`;

    mainChart.data.datasets[0].data = [income, expense];
    mainChart.update();

    renderTable();
    localStorage.setItem('dev.finances:premium', JSON.stringify(transactions));
}

function renderTable() {
    const body = document.getElementById('transaction-body');
    body.innerHTML = '';

    transactions.forEach((t, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.description}</td>
            <td class="${t.type}">R$ ${t.amount.toLocaleString('pt-BR')}</td>
            <td>${t.type === 'income' ? '🟢 Entrada' : '🔴 Saída'}</td>
            <td><span class="remove-btn" onclick="remove(${index})">Deletar</span></td>
        `;
        body.appendChild(row);
    });
}

document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = Number(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    transactions.push({ description, amount, type });
    updateDashboard();
    e.target.reset();

    Toastify({ text: "Transação adicionada!", duration: 2000, style: { background: "#00f298", color: "#000" } }).showToast();
});

function remove(index) {
    transactions.splice(index, 1);
    updateDashboard();
    Toastify({ text: "Removido com sucesso", duration: 2000, style: { background: "#f02d4e" } }).showToast();
}

function showWelcome() {
    Toastify({ text: "Sistema Ativo!", gravity: "top", position: "center", background: "linear-gradient(to right, #00b09b, #96c93d)" }).showToast();
}

updateDashboard();
