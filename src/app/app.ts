
import { Component, inject } from '@angular/core';

import { BancoService } from './services/banco';
import { Saldo } from './components/saldo/saldo';
import { Extrato } from './components/extrato/extrato';
import { Clientes } from './components/clientes/clientes';

@Component({
  selector: 'app-root',
  imports: [Saldo, Extrato, Clientes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private bancoService = inject(BancoService);

  get saldo(): number {
    return this.bancoService.saldo();
  }

  get movimentacoes() {
    return this.bancoService.movimentacoes();
  }

  consultarSaldo(): void {
    alert(
      "Seu saldo é " +
      this.saldo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    );
  }

  depositar(valor: number): void {

    if (this.bancoService.depositar(valor)) {
      alert("Depósito realizado com sucesso!");
    } else {
      alert("Digite um valor válido!");
    }
  }

  sacar(valor: number): void {

    if (!Number.isFinite(valor) || valor <= 0) {
      alert("Digite um valor válido!");
    }
    else if (this.bancoService.sacar(valor)) {
      alert("Saque realizado com sucesso!");
    }
    else {
      alert("Saldo insuficiente!");
    }
  }

  enviarPix(chaveDestino: string, valor: number): void {

    if (chaveDestino.trim() === '') {
      alert("Informe a chave Pix!");
    }
    else if (!Number.isFinite(valor) || valor <= 0) {
      alert("Digite um valor válido!");
    }
    else if (this.bancoService.enviarPix(chaveDestino, valor)) {
      alert("Pix enviado com sucesso!");
    }
    else {
      alert("Saldo insuficiente para realizar o Pix!");
    }
  }
}
