import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Articulo, ItemCarrito} from '../models';
import {
  ArticuloRepository,
  CarritoRepository,
  ItemCarritoRepository,
} from '../repositories';

/**
 * Implementa los métodos del diagrama de clases:
 *   Carrito.AddArticulo(art: Articulo)
 *   Carrito.ListArticulo(): List<Articulo>
 *
 * El carrito guarda sus artículos a través de la clase intermedia ItemCarrito,
 * que además registra la cantidad de cada artículo.
 */
export class CarritoArticuloController {
  constructor(
    @repository(CarritoRepository)
    protected carritoRepository: CarritoRepository,
    @repository(ArticuloRepository)
    protected articuloRepository: ArticuloRepository,
    @repository(ItemCarritoRepository)
    protected itemCarritoRepository: ItemCarritoRepository,
  ) {}

  // ---------- ListArticulo() ----------
  @get('/carritos/{id}/articulos')
  @response(200, {
    description: 'Artículos del carrito, con cantidad, subtotal y total',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            carritoId: {type: 'string'},
            estado: {type: 'string'},
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  articulo: getModelSchemaRef(Articulo),
                  cantidad: {type: 'integer'},
                  subtotal: {type: 'number'},
                },
              },
            },
            total: {type: 'number'},
          },
        },
      },
    },
  })
  async listArticulos(@param.path.string('id') id: string) {
    const carrito = await this.carritoRepository.findById(id);
    const items = await this.itemCarritoRepository.find({
      where: {carritoId: id},
      include: ['articulo'],
    });

    const detalle = items
      .filter(item => item.articulo) // por si se borró un artículo
      .map(item => ({
        articulo: item.articulo!,
        cantidad: item.cantidad,
        subtotal: item.articulo!.costo * item.cantidad,
      }));

    return {
      carritoId: carrito.id,
      estado: carrito.estado,
      items: detalle,
      total: detalle.reduce((acc, d) => acc + d.subtotal, 0),
    };
  }

  // ---------- AddArticulo(art) ----------
  @post('/carritos/{id}/articulos')
  @response(200, {
    description: 'Item del carrito creado o actualizado',
    content: {'application/json': {schema: getModelSchemaRef(ItemCarrito)}},
  })
  async addArticulo(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['articuloId'],
            properties: {
              articuloId: {type: 'string'},
              cantidad: {type: 'integer', minimum: 1, default: 1},
            },
          },
        },
      },
    })
    body: {articuloId: string; cantidad?: number},
  ): Promise<ItemCarrito> {
    const cantidad = body.cantidad ?? 1;

    const carrito = await this.carritoRepository.findById(id);
    if (carrito.estado === 'cerrado') {
      throw new HttpErrors.UnprocessableEntity(
        'El carrito está cerrado, no se pueden agregar artículos',
      );
    }
    // Lanza 404 si el artículo no existe
    await this.articuloRepository.findById(body.articuloId);

    // Si el artículo ya está en el carrito, se suma la cantidad
    const existente = await this.itemCarritoRepository.findOne({
      where: {carritoId: id, articuloId: body.articuloId},
    });
    if (existente) {
      existente.cantidad += cantidad;
      await this.itemCarritoRepository.update(existente);
      return existente;
    }

    return this.carritoRepository
      .items(id)
      .create({articuloId: body.articuloId, cantidad});
  }

  // ---------- Quitar un artículo ----------
  @del('/carritos/{id}/articulos/{articuloId}')
  @response(204, {description: 'Artículo quitado del carrito'})
  async removeArticulo(
    @param.path.string('id') id: string,
    @param.path.string('articuloId') articuloId: string,
  ): Promise<void> {
    await this.carritoRepository.findById(id);
    const {count} = await this.itemCarritoRepository.deleteAll({
      carritoId: id,
      articuloId,
    });
    if (count === 0) {
      throw new HttpErrors.NotFound('El artículo no está en el carrito');
    }
  }
}
