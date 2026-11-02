import {Entity, model, property, hasMany} from '@loopback/repository';
import {Carrito, CarritoWithRelations} from './carrito.model';

@model()
export class Usuario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellido: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {format: 'email'},
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @hasMany(() => Carrito)
  carritos: Carrito[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  carritos?: CarritoWithRelations[];
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
