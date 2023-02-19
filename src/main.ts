import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ClusterService} from "./cluster/cluster.service";
import cluster from "cluster";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  console.log(cluster)
  ClusterService.init(app, 4, bootstrap)
}
bootstrap();