import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClusterModule } from './cluster/cluster.module';

@Module({
  imports: [ClusterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
