
import { Injectable, signal } from '@angular/core';
import { Movimentacao } from '../movimentacao';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  saldo = signal<number>(1500);

  movimentacoes = signal<Movimentacao[]>([]);

  registrarMovimentacao(tipo: string, valor: number): void {

    const movimentacao: Movimentacao = {
      tipo: tipo,
      valor: valor,
      data: new Date()
    };

    this.movimentacoes.update(lista => [
      ...lista,
      movimentacao
    ]);
  }

  depositar(valor: number): boolean {

    if (!Number.isFinite(valor) || valor <= 0) {
      return false;
    }

    this.saldo.update(saldoAtual => saldoAtual + valor);

    this.registrarMovimentacao("Depósito", valor);

    return true;
  }

  sacar(valor: number): boolean {

    if (!Number.isFinite(valor) || valor <= 0 || valor > this.saldo()) {
      return false;
    }

    this.saldo.update(saldoAtual => saldoAtual - valor);

    this.registrarMovimentacao("Saque", valor);

    return true;
  }

  enviarPix(chaveDestino: string, valor: number): boolean {

    if (
      chaveDestino.trim() === '' ||
      !Number.isFinite(valor) ||
      valor <= 0 ||
      valor > this.saldo()
    ) {
      return false;
    }

    this.saldo.update(saldoAtual => saldoAtual - valor);

    this.registrarMovimentacao("Pix", valor);

    return true;
  }
}
