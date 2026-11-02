import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Usuario, Carrito} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioCarritoController {
  constructor(
    @repository(UsuarioRepository)
    protected usuarioRepository: UsuarioRepository,
  ) {}

  @get('/usuarios/{id}/carritos', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Carrito',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Carrito)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Carrito>,
  ): Promise<Carrito[]> {
    return this.usuarioRepository.carritos(id).find(filter);
  }

  @post('/usuarios/{id}/carritos', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Carrito)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {
            title: 'NewCarritoInUsuario',
            exclude: ['id'],
            optional: ['usuarioId'],
          }),
        },
      },
    })
    carrito: Omit<Carrito, 'id'>,
  ): Promise<Carrito> {
    return this.usuarioRepository.carritos(id).create(carrito);
  }

  @patch('/usuarios/{id}/carritos', {
    responses: {
      '200': {
        description: 'Usuario.Carrito PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {partial: true}),
        },
      },
    })
    carrito: Partial<Carrito>,
    @param.query.object('where', getWhereSchemaFor(Carrito))
    where?: Where<Carrito>,
  ): Promise<Count> {
    return this.usuarioRepository.carritos(id).patch(carrito, where);
  }

  @del('/usuarios/{id}/carritos', {
    responses: {
      '200': {
        description: 'Usuario.Carrito DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Carrito))
    where?: Where<Carrito>,
  ): Promise<Count> {
    return this.usuarioRepository.carritos(id).delete(where);
  }
}
