import cluster from "cluster";
import * as process from "process";
import {INestApplication} from "@nestjs/common";
import * as os from "os";

export class ClusterService {
    static init(application: INestApplication, workers: Number, callback: Function): void {
        console.log(cluster)
        if (cluster.isPrimary) {
            console.log(`Primary server started on ${process.pid}`);

            //ensure workers exit cleanly
            process.on('SIGINT', async () => {
                console.log('Cluster shutting down...')
                // exit the master process
                await application.close()
                process.exit()
            })

            const cpus = os.cpus().length

            cluster.on('online', function (worker) {
                console.log('Worker %s is online', worker.process.pid);
            });

            cluster.on('exit', (worker, code, signal) => {
                console.log(`Worker ${worker.process.pid} died. Restarting`);
                cluster.fork();
            })
        }
    }
}