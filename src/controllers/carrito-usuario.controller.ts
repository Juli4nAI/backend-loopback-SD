import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Carrito, Usuario} from '../models';
import {CarritoRepository} from '../repositories';

export class CarritoUsuarioController {
  constructor(
    @repository(CarritoRepository)
    public carritoRepository: CarritoRepository,
  ) {}

  @get('/carritos/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Carrito',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usuario),
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.string('id') id: typeof Carrito.prototype.id,
  ): Promise<Usuario> {
    return this.carritoRepository.usuario(id);
  }
}
