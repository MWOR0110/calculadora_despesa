// Importando as bibliotecas necessárias
import React, { useState, useEffect } from 'react';
import './App.css'; // Importando o estilo do componente

// Definindo o componente funcional App
const App = () => {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('Pagamento');
  const [pagoPor, setPagoPor] = useState('');
  const [despesas, setDespesas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [totalPagamentos, setTotalPagamentos] = useState(0);

  useEffect(() => {
    const savedDespesas = JSON.parse(localStorage.getItem('despesas')) || [];
    const savedPagamentos = JSON.parse(localStorage.getItem('pagamentos')) || [];

    setDespesas(savedDespesas);
    setPagamentos(savedPagamentos);
  }, []);

  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas));
    localStorage.setItem('pagamentos', JSON.stringify(pagamentos));

    const calcularTotalDespesas = () => {
      const total = despesas.reduce((acc, despesa) => acc + parseFloat(despesa.valor), 0);
      setTotalDespesas(total);
    };

    const calcularTotalPagamentos = () => {
      const total = pagamentos.reduce((acc, pagamento) => acc + parseFloat(pagamento.valor), 0);
      setTotalPagamentos(total);
    };

    calcularTotalDespesas();
    calcularTotalPagamentos();
  }, [despesas, pagamentos]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const novoItem = { nome, valor, tipo, pagoPor, concluido: false };
    if (tipo === 'Despesa') {
      const updatedDespesas = [...despesas, novoItem];
      setDespesas(updatedDespesas);
      localStorage.setItem('despesas', JSON.stringify(updatedDespesas)); // Armazena no localStorage
    } else {
      const updatedPagamentos = [...pagamentos, novoItem];
      setPagamentos(updatedPagamentos);
      localStorage.setItem('pagamentos', JSON.stringify(updatedPagamentos)); // Armazena no localStorage
    }
    setNome('');
    setValor('');
    setPagoPor('');
  };

  const handleDelete = (index, tipo) => {
    if (tipo === 'Despesa') {
      const updatedDespesas = [...despesas];
      updatedDespesas.splice(index, 1);
      setDespesas(updatedDespesas);
      localStorage.setItem('despesas', JSON.stringify(updatedDespesas)); // Armazena no localStorage
    } else {
      const updatedPagamentos = [...pagamentos];
      updatedPagamentos.splice(index, 1);
      setPagamentos(updatedPagamentos);
      localStorage.setItem('pagamentos', JSON.stringify(updatedPagamentos)); // Armazena no localStorage
    }
  };

  const handleToggle = (index, tipo) => {
    if (tipo === 'Despesa') {
      const updatedDespesas = [...despesas];
      updatedDespesas[index].concluido = !updatedDespesas[index].concluido;
      setDespesas(updatedDespesas);
      localStorage.setItem('despesas', JSON.stringify(updatedDespesas)); // Armazena no localStorage
    } else {
      const updatedPagamentos = [...pagamentos];
      updatedPagamentos[index].concluido = !updatedPagamentos[index].concluido;
      setPagamentos(updatedPagamentos);
      localStorage.setItem('pagamentos', JSON.stringify(updatedPagamentos)); // Armazena no localStorage
    }
  };


  return (
    <div className="container">
      <div className="sidebar">
        <h2 className="sidebar-title">Calculadora de Receita e Despesas</h2>
        <form onSubmit={handleSubmit}>
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
        <div className="table-wrapper">
          <h2 className="table-title">Despesas</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Valor</th>
                <th>Pago Por</th>
                <th>Status</th>
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
                    <input
                      type="checkbox"
                      checked={despesa.concluido}
                      onChange={() => handleToggle(index, 'Despesa')}
                    />
                    {despesa.concluido ? 'Concluído' : 'Pendente'}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(index, 'Despesa')}>Excluir</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5">Total: {totalDespesas.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-wrapper">
          <h2 className="table-title">Pagamentos</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Valor</th>
                <th>Pago Por</th>
                <th>Status</th>
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
                    <input
                      type="checkbox"
                      checked={pagamento.concluido}
                      onChange={() => handleToggle(index, 'Pagamento')}
                    />
                    {pagamento.concluido ? 'Concluído' : 'Pendente'}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(index, 'Pagamento')}>Excluir</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5">Total: {totalPagamentos.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
