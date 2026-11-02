import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Carrito} from '../models';
import {CarritoRepository} from './carrito.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {
  public readonly carritos: HasManyRepositoryFactory<
    Carrito,
    typeof Usuario.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('CarritoRepository')
    protected carritoRepositoryGetter: Getter<CarritoRepository>,
  ) {
    super(Usuario, dataSource);
    this.carritos = this.createHasManyRepositoryFactoryFor(
      'carritos',
      carritoRepositoryGetter,
    );
    this.registerInclusionResolver('carritos', this.carritos.inclusionResolver);
  }
}
