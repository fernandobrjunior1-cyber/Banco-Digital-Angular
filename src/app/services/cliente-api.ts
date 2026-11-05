
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../models/cliente';
import { ClienteCadastro } from '../models/cliente-cadastro';
import { Paginacao } from '../models/paginacao';

@Injectable({
  providedIn: 'root'
})
export class ClienteApiService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5114/api/v1/clientes';

  // GET - Pesquisa, paginação e ordenação
  listarClientes(
    busca: string = '',
    pagina: number = 1,
    tamanhoPagina: number = 10,
    ordenarPor: string = 'nome',
    direcao: string = 'asc'
  ): Observable<Paginacao<Cliente>> {

    const params = new HttpParams()
      .set('busca', busca)
      .set('pagina', pagina.toString())
      .set('tamanhoPagina', tamanhoPagina.toString())
      .set('ordenarPor', ordenarPor)
      .set('direcao', direcao);

    return this.http.get<Paginacao<Cliente>>(
      this.apiUrl,
      { params }
    );
  }

  // POST - Cadastrar
  cadastrarCliente(cliente: ClienteCadastro): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // PUT - Atualizar
  atualizarCliente(
    id: number,
    cliente: ClienteCadastro
  ): Observable<Cliente> {

    return this.http.put<Cliente>(
      `${this.apiUrl}/${id}`,
      cliente
    );
  }

  // DELETE - Excluir
  excluirCliente(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
