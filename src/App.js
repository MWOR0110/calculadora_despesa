// Importando as bibliotecas necessárias
import React, { useState, useEffect } from 'react';
import './App.css'; // Importando o estilo do componente

// Definindo o componente funcional App
const App = () => {
  // Definindo os estados iniciais utilizando hooks do React
  const [nome, setNome] = useState(''); // Estado para o nome
  const [valor, setValor] = useState(''); // Estado para o valor
  const [tipo, setTipo] = useState('Pagamento'); // Estado para o tipo (Despesa ou Pagamento)
  const [pagoPor, setPagoPor] = useState(''); // Estad  o para quem pagou
  const [despesas, setDespesas] = useState([]); // Estado para armazenar as despesas
  const [pagamentos, setPagamentos] = useState([]); // Estado para armazenar os pagamentos
  const [totalDespesas, setTotalDespesas] = useState(0); // Estado para o total de despesas
  const [totalPagamentos, setTotalPagamentos] = useState(0); // Estado para o total de pagamentos

  // Hook useEffect para carregar os dados do Local Storage ao carregar a página
  useEffect(() => {
    const savedDespesas = JSON.parse(localStorage.getItem('despesas')) || [];
    const savedPagamentos = JSON.parse(localStorage.getItem('pagamentos')) || [];

    setDespesas(savedDespesas);
    setPagamentos(savedPagamentos);
  }, []);

  // Hook useEffect para atualizar o Local Storage sempre que houver mudanças em despesas ou pagamentos
  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas));
    localStorage.setItem('pagamentos', JSON.stringify(pagamentos));

    // Função para calcular o total de despesas
    const calcularTotalDespesas = () => {
      const total = despesas.reduce((acc, despesa) => acc + parseFloat(despesa.valor), 0);
      setTotalDespesas(total);
    };

    // Função para calcular o total de pagamentos
    const calcularTotalPagamentos = () => {
      const total = pagamentos.reduce((acc, pagamento) => acc + parseFloat(pagamento.valor), 0);
      setTotalPagamentos(total);
    };

    calcularTotalDespesas();
    calcularTotalPagamentos();
  }, [despesas, pagamentos]);

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    const novoItem = { nome, valor, tipo, pagoPor };
    if (tipo === 'Despesa') {
      setDespesas([...despesas, novoItem]);
    } else {
      setPagamentos([...pagamentos, novoItem]);
    }
    setNome('');
    setValor('');
    setPagoPor('');
  };

  // Função para lidar com a exclusão de um item (despesa ou pagamento)
  const handleDelete = (index, tipo) => {
    if (tipo === 'Despesa') {
      const novasDespesas = [...despesas];
      novasDespesas.splice(index, 1);
      setDespesas(novasDespesas);
    } else {
      const novosPagamentos = [...pagamentos];
      novosPagamentos.splice(index, 1);
      setPagamentos(novosPagamentos);
    }
  };

  // Obtendo a última despesa e último pagamento, se existirem
  const ultimaDespesa = despesas.length > 0 ? despesas[despesas.length - 1] : null;
  const ultimoPagamento = pagamentos.length > 0 ? pagamentos[pagamentos.length - 1] : null;

  // Retornando o JSX do componente
  return (
    <div className="container">
      <div className="sidebar">
        <h2 className="sidebar-title">Calculadora de Receita e Despesas</h2>
        <form onSubmit={handleSubmit}>
          {/* Formulário para adicionar uma despesa ou pagamento */}
          <label>
            Nome:
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>
          <label>
            Valor:
            <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
          </label>
          <label>
            Tipo:
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Despesa">Despesa</option>
              <option value="Pagamento">Pagamento</option>
            </select>
          </label>
          <label>
            Pago por:
            <input type="text" value={pagoPor} onChange={(e) => setPagoPor(e.target.value)} />
          </label>
          <button type="submit">Cadastrar</button>
        </form>

        {/* Tabela com informações sobre despesas, pagamentos e saldo */}
        <h3>Saldo Total</h3>
        <table className="info-table">
          <tbody>
            <tr>
              <td>Despesas</td>
              <td>-{totalDespesas.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Pagamentos</td>
              <td>+{totalPagamentos.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Saldo</td>
              <td>{(totalPagamentos - totalDespesas).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{totalPagamentos >= totalDespesas ? 'Em dia' : 'Devendo'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="content">
        {/* Tabela de Despesas */}
        <div className="table-wrapper">
          <h2 className="table-title">Despesas</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Valor</th>
                <th>Pago Por</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {despesas.map((despesa, index) => (
                <tr key={index}>
                  <td>{despesa.nome}</td>
                  <td>{despesa.valor}</td>
                  <td>{despesa.pagoPor}</td>
                  <td>
                    <button onClick={() => handleDelete(index, 'Despesa')}>Excluir</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4">Total: {totalDespesas.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabela de Pagamentos */}
        <div className="table-wrapper">
          <h2 className="table-title">Pagamentos</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Valor</th>
                <th>Pago Por</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((pagamento, index) => (
                <tr key={index}>
                  <td>{pagamento.nome}</td>
                  <td>{pagamento.valor}</td>
                  <td>{pagamento.pagoPor}</td>
                  <td>
                    <button onClick={() => handleDelete(index, 'Pagamento')}>Excluir</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4">Total: {totalPagamentos.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App; // Exportando o componente App
