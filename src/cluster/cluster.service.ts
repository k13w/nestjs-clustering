import cluster, { Worker } from 'cluster';
import os from 'os';
import { Logger } from '@nestjs/common';

export class AppClusterService {
    static clusterize(workers: number, callback: () => void): void {
        if (cluster.isPrimary) {
            const numCPUs = os.cpus().length;
            const numWorkers = Math.min(numCPUs, workers);

            Logger.log(`Primary server started on ${process.pid}`);

            for (let i = 0; i < numWorkers; i++) {
                cluster.fork();
            }

            cluster.on('online', (worker: Worker) => {
                Logger.log(`Worker ${worker.process.pid} is online.`);
            });

            // cluster.on('exit', (worker: Worker, code: number, signal: string) => {
            //     Logger.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}. Restarting.`);
            //     cluster.fork();
            // });
            process.on( "SIGTERM", function() {
                console.log( "\ngracefully shutting down from SIGINT (Crtl-C)" );
                process.exit();
            } );

            process.once('SIGTERM', () => {
                console.log("oii")
                Logger.log('Cluster shutting down...');
                for (const id in cluster.workers) {
                    if (cluster.workers.hasOwnProperty(id)) {
                        const worker = cluster.workers[id];
                        worker.kill();
                    }
                }
                process.exit(0);
            });
        } else {
            callback();
        }
    }
}