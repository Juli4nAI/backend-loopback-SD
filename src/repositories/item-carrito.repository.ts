import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {ItemCarrito, ItemCarritoRelations, Carrito, Articulo} from '../models';
import {CarritoRepository} from './carrito.repository';
import {ArticuloRepository} from './articulo.repository';

export class ItemCarritoRepository extends DefaultCrudRepository<
  ItemCarrito,
  typeof ItemCarrito.prototype.id,
  ItemCarritoRelations
> {
  public readonly carrito: BelongsToAccessor<
    Carrito,
    typeof ItemCarrito.prototype.id
  >;

  public readonly articulo: BelongsToAccessor<
    Articulo,
    typeof ItemCarrito.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('CarritoRepository')
    protected carritoRepositoryGetter: Getter<CarritoRepository>,
    @repository.getter('ArticuloRepository')
    protected articuloRepositoryGetter: Getter<ArticuloRepository>,
  ) {
    super(ItemCarrito, dataSource);
    this.articulo = this.createBelongsToAccessorFor(
      'articulo',
      articuloRepositoryGetter,
    );
    this.registerInclusionResolver('articulo', this.articulo.inclusionResolver);
    this.carrito = this.createBelongsToAccessorFor(
      'carrito',
      carritoRepositoryGetter,
    );
    this.registerInclusionResolver('carrito', this.carrito.inclusionResolver);
  }
}
