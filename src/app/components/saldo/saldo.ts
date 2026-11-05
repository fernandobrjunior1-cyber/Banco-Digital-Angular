import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-saldo',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './saldo.html',
  styleUrl: './saldo.css'
})
export class Saldo {
  @Input() saldo: number = 0; 
}