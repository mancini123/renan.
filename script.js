let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function adicionarTransacao() {
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const categoria = document.getElementById('categoria').value;
    const data = document.getElementById('data').value;
    const tipo = document.getElementById('tipo').value;
    
    if (descricao && valor && categoria && data) {
        const transaction = {
            id: Date.now(),
            descricao: descricao,
            valor: tipo === 'despesa' ? -valor : valor,
            categoria: categoria,
            data: data,
            tipo: tipo
        };
        
        transactions.push(transaction);
        saveTransactions();
        atualizarInterface();
        
        // Limpar campos
        document.getElementById('descricao').value = '';
        document.getElementById('valor').value = '';
        document.getElementById('data').value = '';
        document.getElementById('categoria').value = 'outros';
        document.getElementById('tipo').value = 'despesa';
    }
}

function atualizarInterface() {
    const listaTransacoes = document.getElementById('lista-transacoes');
    const totalReceitas = document.getElementById('total-receitas');
    const totalDespesas = document.getElementById('total-despesas');
    const saldoTotal = document.getElementById('saldo-total');
    
    listaTransacoes.innerHTML = '';
    
    let receitas = 0;
    let despesas = 0;

    const transacoesFiltradas = filtrarTransacoes();
    
    transacoesFiltradas.forEach(transaction => {
        if (transaction.valor > 0) {
            receitas += transaction.valor;
        } else {
            despesas += Math.abs(transaction.valor);
        }

        const div = document.createElement('div');
        div.className = 'transacao';
        div.innerHTML = `
            <div class="transacao-info">
                <span>${transaction.descricao}</span>
                <span class="transacao-data">${formatarData(transaction.data)}</span>
                <span class="transacao-categoria">${transaction.categoria}</span>
            </div>
            <span class="${transaction.valor > 0 ? 'receita' : 'despesa'}">
                R$ ${Math.abs(transaction.valor).toFixed(2)}
            </span>
            <button onclick="removerTransacao(${transaction.id})">Remover</button>
        `;
        listaTransacoes.appendChild(div);
    });
    
    totalReceitas.textContent = `R$ ${receitas.toFixed(2)}`;
    totalDespesas.textContent = `R$ ${despesas.toFixed(2)}`;
    saldoTotal.textContent = `R$ ${(receitas - despesas).toFixed(2)}`;
}

function filtrarTransacoes() {
    const categoriaSelecionada = document.getElementById('filtro-categoria').value;
    const tipoSelecionado = document.getElementById('filtro-tipo').value;
    
    return transactions.filter(transaction => {
        const categoriaMatch = categoriaSelecionada === 'todas' || transaction.categoria === categoriaSelecionada;
        const tipoMatch = tipoSelecionado === 'todos' || 
                         (tipoSelecionado === 'receita' && transaction.valor > 0) ||
                         (tipoSelecionado === 'despesa' && transaction.valor < 0);
        
        return categoriaMatch && tipoMatch;
    });
}

function removerTransacao(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    atualizarInterface();
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Definir data atual como padrão no input de data
window.onload = function() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').value = hoje;
    atualizarInterface();
};