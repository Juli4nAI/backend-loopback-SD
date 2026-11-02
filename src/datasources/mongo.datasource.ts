import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// La URL de conexión se lee de la variable de entorno MONGODB_URL (archivo .env).
// Así la contraseña de MongoDB Atlas no queda subida al repositorio.
// Ejemplo Atlas:  mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/api_rest_loopback?retryWrites=true&w=majority
// Ejemplo local:  mongodb://127.0.0.1:27017/api_rest_loopback
const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: process.env.MONGODB_URL ?? 'mongodb://127.0.0.1:27017/api_rest_loopback',
  database: process.env.MONGODB_DATABASE ?? 'api_rest_loopback',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mongo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
