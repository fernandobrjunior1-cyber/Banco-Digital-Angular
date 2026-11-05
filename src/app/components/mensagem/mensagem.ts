
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-mensagem',
  imports: [],
  templateUrl: './mensagem.html',
  styleUrl: './mensagem.css'
})
export class Mensagem {

  // Texto recebido do componente pai
  texto = input<string>('');

  // Tipo da mensagem: sucesso ou erro
  tipo = input<'sucesso' | 'erro'>('sucesso');

  // Evento enviado ao componente pai
  fechar = output<void>();

  fecharMensagem(): void {
    this.fechar.emit();
  }
}
