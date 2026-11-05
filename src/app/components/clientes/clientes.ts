
import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';

import { Cliente } from '../../models/cliente';
import { ClienteCadastro } from '../../models/cliente-cadastro';
import { ClienteApiService } from '../../services/cliente-api';
import { Mensagem } from '../mensagem/mensagem';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, Mensagem],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  private clienteApi = inject(ClienteApiService);

  // Referência ao formulário HTML
  @ViewChild('formCliente')
  formCliente?: NgForm;

  // Lista de clientes
  clientes = signal<Cliente[]>([]);

  // Controle de carregamento
  carregando = signal(false);
  salvando = signal(false);
  excluindoId = signal<number | null>(null);

  // Mensagens
  erro = signal('');
  mensagem = signal('');
  tipoMensagem = signal<'sucesso' | 'erro'>('sucesso');

  // Controle de edição
  clienteEditando = signal<number | null>(null);

  // Pesquisa
  busca = signal('');

  // Paginação
  pagina = signal(1);
  tamanhoPagina = signal(3);
  totalPaginas = signal(1);
  totalRegistros = signal(0);

  // Ordenação
  ordenarPor = signal('nome');
  direcao = signal('asc');

  // Dados do formulário
  novoCliente: ClienteCadastro = this.formularioVazio();

  // Inicialização
  ngOnInit(): void {
    this.listarClientes();
  }

  // Criar formulário vazio
  formularioVazio(): ClienteCadastro {
    return {
      nome: '',
      cidade: '',
      email: '',
      telefone: ''
    };
  }

  // Exibir mensagem de sucesso
  mostrarSucesso(texto: string): void {
    this.tipoMensagem.set('sucesso');
    this.mensagem.set(texto);
  }

  // Exibir mensagem de erro
  mostrarErro(texto: string): void {
    this.tipoMensagem.set('erro');
    this.mensagem.set(texto);
  }

  // Fechar mensagem
  fecharMensagem(): void {
    this.mensagem.set('');
  }

  // Consultar clientes na API
  listarClientes(): void {

    this.carregando.set(true);
    this.erro.set('');

    this.clienteApi.listarClientes(
      this.busca(),
      this.pagina(),
      this.tamanhoPagina(),
      this.ordenarPor(),
      this.direcao()
    )
    .pipe(
      finalize(() => {
        this.carregando.set(false);
      })
    )
    .subscribe({

      next: (resposta) => {

        this.clientes.set(resposta.dados);
        this.totalPaginas.set(resposta.totalPaginas);
        this.totalRegistros.set(resposta.totalRegistros);

      },

      error: (erro) => {

        console.error('Erro ao listar clientes:', erro);

        this.erro.set(
          'Não foi possível carregar os clientes.'
        );

      }
    });
  }

  // Pesquisar clientes
  pesquisarClientes(): void {

    this.pagina.set(1);
    this.listarClientes();

  }

  // Aplicar ordenação
  aplicarOrdenacao(): void {

    this.pagina.set(1);
    this.listarClientes();

  }

  // Próxima página
  proximaPagina(): void {

    if (this.pagina() < this.totalPaginas()) {

      this.pagina.update(valor => valor + 1);
      this.listarClientes();

    }
  }

  // Página anterior
  paginaAnterior(): void {

    if (this.pagina() > 1) {

      this.pagina.update(valor => valor - 1);
      this.listarClientes();

    }
  }

  // Selecionar cliente para edição
  editarCliente(cliente: Cliente): void {

    if (this.salvando() || this.excluindoId() !== null) {
      return;
    }

    this.clienteEditando.set(cliente.id);

    this.novoCliente = {
      nome: cliente.nome,
      cidade: cliente.cidade,
      email: cliente.email,
      telefone: cliente.telefone
    };

    // Limpar mensagens anteriores
    this.mensagem.set('');

    // Limpar estado de validação do formulário
    this.formCliente?.resetForm(this.novoCliente);
  }

  // Cancelar edição
  cancelarEdicao(): void {

    if (this.salvando()) {
      return;
    }

    this.clienteEditando.set(null);

    // Limpar dados e validações
    this.formCliente?.resetForm(this.formularioVazio());

    this.mensagem.set('');
  }

  // Cadastrar ou atualizar cliente
  salvarCliente(): void {

    if (this.salvando() || this.excluindoId() !== null) {
      return;
    }

    const nome = this.novoCliente.nome.trim();
    const cidade = this.novoCliente.cidade.trim();
    const email = this.novoCliente.email.trim();
    const telefone = this.novoCliente.telefone.trim();

    // Validar nome
    if (nome.length < 3) {

      this.mostrarErro(
        'O nome deve ter pelo menos 3 caracteres.'
      );

      return;
    }

    // Validar cidade
    if (!cidade) {

      this.mostrarErro('Informe a cidade.');
      return;
    }

    // Validar e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {

      this.mostrarErro('Informe um e-mail válido.');
      return;
    }

    // Validar telefone
    const telefoneValido = /^[0-9]{10,11}$/;

    if (!telefoneValido.test(telefone)) {

      this.mostrarErro(
        'O telefone deve conter 10 ou 11 números.'
      );

      return;
    }

    // Iniciar salvamento
    this.salvando.set(true);
    this.mensagem.set('');

    const dados: ClienteCadastro = {
      nome,
      cidade,
      email,
      telefone
    };

    const id = this.clienteEditando();

    // Escolher POST ou PUT
    const requisicao = id === null
      ? this.clienteApi.cadastrarCliente(dados)
      : this.clienteApi.atualizarCliente(id, dados);

    requisicao
      .pipe(
        finalize(() => {
          this.salvando.set(false);
        })
      )
      .subscribe({

        next: () => {

          this.mostrarSucesso(
            id === null
              ? 'Cliente cadastrado com sucesso!'
              : 'Cliente atualizado com sucesso!'
          );

          // Sair do modo de edição
          this.clienteEditando.set(null);

          // Limpar campos e erros de validação
          this.formCliente?.resetForm(
            this.formularioVazio()
          );

          // Atualizar listagem
          this.listarClientes();

        },

        error: (erro) => {

          console.error('Erro ao salvar cliente:', erro);

          if (erro.status === 0) {

            this.mostrarErro(
              'Não foi possível conectar à API. Verifique se ela está executando.'
            );

          } else if (erro.status === 400) {

            this.mostrarErro(
              'A API rejeitou os dados enviados. Verifique as informações.'
            );

          } else if (erro.status === 404) {

            this.mostrarErro(
              'Cliente não encontrado.'
            );

          } else if (erro.status === 409) {

            this.mostrarErro(
              'Conflito ao salvar o cliente. Verifique os dados.'
            );

          } else if (erro.status === 500) {

            this.mostrarErro(
              'O servidor encontrou um erro interno.'
            );

          } else {

            this.mostrarErro(
              'Não foi possível salvar o cliente.'
            );

          }
        }
      });
  }

  // Excluir cliente
  excluirCliente(cliente: Cliente): void {

    if (this.salvando() || this.excluindoId() !== null) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir o cliente ${cliente.nome}?`
    );

    if (!confirmar) {
      return;
    }

    this.excluindoId.set(cliente.id);
    this.mensagem.set('');

    this.clienteApi.excluirCliente(cliente.id)
      .pipe(
        finalize(() => {
          this.excluindoId.set(null);
        })
      )
      .subscribe({

        next: () => {

          this.mostrarSucesso(
            'Cliente excluído com sucesso!'
          );

          // Se estava editando o cliente excluído
          if (this.clienteEditando() === cliente.id) {

            this.clienteEditando.set(null);

            this.formCliente?.resetForm(
              this.formularioVazio()
            );
          }

          // Voltar uma página se a atual ficou vazia
          if (
            this.clientes().length === 1 &&
            this.pagina() > 1
          ) {
            this.pagina.update(valor => valor - 1);
          }

          // Atualizar clientes
          this.listarClientes();

        },

        error: (erro) => {

          console.error('Erro ao excluir cliente:', erro);

          this.mostrarErro(
            'Não foi possível excluir o cliente.'
          );

        }
      });
  }
}
