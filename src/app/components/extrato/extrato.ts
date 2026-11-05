
import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Movimentacao } from '../../movimentacao';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './extrato.html',
  styleUrl: './extrato.css'
})
export class Extrato {
  @Input() movimentacoes: Movimentacao[] = [];
}

