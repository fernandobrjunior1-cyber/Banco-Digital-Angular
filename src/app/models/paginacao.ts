
export interface Paginacao<T> {
  pagina: number;
  tamanhoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  dados: T[];
}
