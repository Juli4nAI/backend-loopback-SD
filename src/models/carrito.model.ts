import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {Usuario, UsuarioWithRelations} from './usuario.model';
import {ItemCarrito, ItemCarritoWithRelations} from './item-carrito.model';

@model()
export class Carrito extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  fechaCreacion?: string;

  @property({
    type: 'string',
    default: 'abierto',
    jsonSchema: {enum: ['abierto', 'cerrado']},
  })
  estado?: string;

  // El carrito pertenece a un usuario logueado en el sistema
  @belongsTo(() => Usuario, {}, {required: true})
  usuarioId: string;

  @hasMany(() => ItemCarrito)
  items: ItemCarrito[];

  constructor(data?: Partial<Carrito>) {
    super(data);
  }
}

export interface CarritoRelations {
  usuario?: UsuarioWithRelations;
  items?: ItemCarritoWithRelations[];
}

export type CarritoWithRelations = Carrito & CarritoRelations;
