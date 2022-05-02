import { Evento } from './Evento';
import { UserUpdate } from './identify/UserUpdate';
import { PalestranteEvento } from './PalestranteEvento';
import { RedeSocial } from './RedeSocial';

export interface Palestrante {
  id: number;

  // nome: string;

  miniCurriculo: string;

  // imagemURL: string;

  // telefone: string;

  // email: string;

  user: UserUpdate;

  redesSociais: RedeSocial[];

  palestrantesEventos: Evento[];
}
