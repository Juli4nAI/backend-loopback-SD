import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Carrito} from '../models';
import {CarritoRepository} from '../repositories';

export class CarritoController {
  constructor(
    @repository(CarritoRepository)
    public carritoRepository: CarritoRepository,
  ) {}

  @post('/carritos')
  @response(200, {
    description: 'Carrito model instance',
    content: {'application/json': {schema: getModelSchemaRef(Carrito)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {
            title: 'NewCarrito',
            exclude: ['id'],
          }),
        },
      },
    })
    carrito: Omit<Carrito, 'id'>,
  ): Promise<Carrito> {
    return this.carritoRepository.create(carrito);
  }

  @get('/carritos/count')
  @response(200, {
    description: 'Carrito model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Carrito) where?: Where<Carrito>): Promise<Count> {
    return this.carritoRepository.count(where);
  }

  @get('/carritos')
  @response(200, {
    description: 'Array of Carrito model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Carrito, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Carrito) filter?: Filter<Carrito>,
  ): Promise<Carrito[]> {
    return this.carritoRepository.find(filter);
  }

  @patch('/carritos')
  @response(200, {
    description: 'Carrito PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {partial: true}),
        },
      },
    })
    carrito: Carrito,
    @param.where(Carrito) where?: Where<Carrito>,
  ): Promise<Count> {
    return this.carritoRepository.updateAll(carrito, where);
  }

  @get('/carritos/{id}')
  @response(200, {
    description: 'Carrito model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Carrito, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Carrito, {exclude: 'where'})
    filter?: FilterExcludingWhere<Carrito>,
  ): Promise<Carrito> {
    return this.carritoRepository.findById(id, filter);
  }

  @patch('/carritos/{id}')
  @response(204, {
    description: 'Carrito PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carrito, {partial: true}),
        },
      },
    })
    carrito: Carrito,
  ): Promise<void> {
    await this.carritoRepository.updateById(id, carrito);
  }

  @put('/carritos/{id}')
  @response(204, {
    description: 'Carrito PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() carrito: Carrito,
  ): Promise<void> {
    await this.carritoRepository.replaceById(id, carrito);
  }

  @del('/carritos/{id}')
  @response(204, {
    description: 'Carrito DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.carritoRepository.deleteById(id);
  }
}
