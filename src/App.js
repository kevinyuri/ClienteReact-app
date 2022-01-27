import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import logoCadastro from "./assets/cadastro.jpg";

function App() {
  const baseUrl = "https://localhost:44313/api/v1/clientes";

  const [data, setData] = useState([]);

  const [modalIncluir, setModalIncluir] = useState(false);

  const [modalEditar, setModalEditar] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState({
    Id: "",
    Nome: "",
    Sobrenome: "",
    DataNascimento: "",
    CPF: "",
    EnderecoId: "",
  });

  const selecionarCliente = (cliente, opcao) => {
    setClienteSelecionado(cliente);
    opcao === "Editar" && abrirFecharModalEditar();
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteSelecionado({
      ...clienteSelecionado,
      [name]: value,
    });
    console.log(clienteSelecionado);
  };

  const pedidoGet = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    delete clienteSelecionado.Id;
    clienteSelecionado.EnderecoId = parseInt(clienteSelecionado.EnderecoId);
    await axios
      .post(baseUrl, clienteSelecionado)
      .then((response) => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPut = async () => {
    clienteSelecionado.EnderecoId = parseInt(clienteSelecionado.EnderecoId);
    await axios
      .put(baseUrl + "/" + clienteSelecionado.id, clienteSelecionado)
      .then((response) => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map((Cliente) => {
          if (Cliente.id === clienteSelecionado.Id) {
            Cliente.Nome = resposta.Nome;
            Cliente.Sobrenome = resposta.Sobrenome;
            Cliente.DataNascimento = resposta.DataNascimento;
            Cliente.CPF = resposta.CPF;
            Cliente.EnderecoId = resposta.EnderecoId;
          }
        });
        abrirFecharModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    pedidoGet();
  });

  return (
    <div className="aluno-container">
      <br />
      <h3>Cadastro de Clientes</h3>

      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <button
          onClick={() => abrirFecharModalIncluir()}
          className="btn btn-success"
        >
          Incluir novo cliente
        </button>
      </header>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Data de Nascimento</th>
            <th>CPF</th>
            <th>Endereco</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nomeCompleto}</td>
              <td>{cliente.dataNascimento}</td>
              <td>{cliente.cpf}</td>
              <td>{cliente.endereco}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => selecionarCliente(cliente, "Editar")}
                >
                  Editar
                </button>
                {"  "}
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarCliente(cliente, "Excluir")}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Clientes</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="Nome"
              onChange={handleChange}
            />
            <br />
            <label>Sobrenome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="Sobrenome"
              onChange={handleChange}
            />
            <br />
            <label>Data de Nascimento: </label>
            <br />
            <input
              type="date"
              className="form-control"
              name="DataNascimento"
              onChange={handleChange}
            />
            <br />
            <label>CPF: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="CPF"
              onChange={handleChange}
            />
            <br />
            <label>EnderecoId: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="EnderecoId"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>
            Incluir
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalIncluir()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Clientes</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="id"
              readOnly
              value={clienteSelecionado && clienteSelecionado.id}
            />
            <br />
            <label> Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.Nome}
            />
            <br />
            <label>Sobrenome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="Sobrenome"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.Sobrenome}
            />
            <br />
            <label>Data de Nascimento: </label>
            <br />
            <input
              type="date"
              className="form-control"
              name="dataNascimento"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.DataNascimento}
            />
            <br />
            <label>CPF: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="cpf"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.cpf}
            />
            <br />
            <label>EnderecoId: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="enderecoId"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.enderecoId}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>
            Editar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
