import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AppClusterService} from "./cluster/cluster.service";
import * as process from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}


//Call app-cluster.service.ts here.
AppClusterService.clusterize( 4, bootstrap);