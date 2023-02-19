import cluster from "cluster";
import * as process from "process";
import * as os from "os";
import {Logger} from "@nestjs/common";

export class AppClusterService {
    static clusterize(workers: Number, callback: Function): void {
        if (cluster.isPrimary) {

            Logger.log(`Primary server started on ${process.pid}`);

            const processesCount = os.cpus().length

            for (let index = 0; index < processesCount; index++) {
                cluster.fork()
            }

            // process.on('SIGINT', function () {
            //     console.log('Cluster shutting down...');
            //     for (var id in cluster.workers) {
            //         cluster.workers[id].kill();
            //     }
            //     // exit the master process
            //     process.exit(0);
            // });
            //
            //
            cluster.on('online', function (worker) {
                Logger.log( 'Worker ' + worker.process.pid + ' is online.' );
            });

            cluster.on('exit', (worker, code, signal) => {
                Logger.log(`Worker ${worker.process.pid} died. Restarting`);
                cluster.fork();
            })
        } else {
            callback();
        }
    }
}