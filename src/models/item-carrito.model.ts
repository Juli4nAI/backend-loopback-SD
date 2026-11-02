import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Carrito, CarritoWithRelations} from './carrito.model';
import {Articulo, ArticuloWithRelations} from './articulo.model';

@model()
export class ItemCarrito extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {type: 'integer', minimum: 1},
  })
  cantidad: number;

  @belongsTo(() => Carrito, {}, {required: true})
  carritoId: string;

  @belongsTo(() => Articulo, {}, {required: true})
  articuloId: string;

  constructor(data?: Partial<ItemCarrito>) {
    super(data);
  }
}

export interface ItemCarritoRelations {
  carrito?: CarritoWithRelations;
  articulo?: ArticuloWithRelations;
}

export type ItemCarritoWithRelations = ItemCarrito & ItemCarritoRelations;
