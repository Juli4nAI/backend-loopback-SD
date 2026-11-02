import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Carrito, CarritoRelations, Usuario, ItemCarrito} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {ItemCarritoRepository} from './item-carrito.repository';

export class CarritoRepository extends DefaultCrudRepository<
  Carrito,
  typeof Carrito.prototype.id,
  CarritoRelations
> {
  public readonly usuario: BelongsToAccessor<
    Usuario,
    typeof Carrito.prototype.id
  >;

  public readonly items: HasManyRepositoryFactory<
    ItemCarrito,
    typeof Carrito.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UsuarioRepository')
    protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
    @repository.getter('ItemCarritoRepository')
    protected itemCarritoRepositoryGetter: Getter<ItemCarritoRepository>,
  ) {
    super(Carrito, dataSource);
    this.items = this.createHasManyRepositoryFactoryFor(
      'items',
      itemCarritoRepositoryGetter,
    );
    this.registerInclusionResolver('items', this.items.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor(
      'usuario',
      usuarioRepositoryGetter,
    );
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}
