import { Observable, Subject } from 'rxjs';
import { RayTracingWorkerDataInterface } from '../interfaces/ray-tracing-worker-data.interface';

export class RayTracingWorkerService {
  workers!: Worker[];

  numWorkers = Math.floor(navigator.hardwareConcurrency / 2) || 4;

  constructor() {
    this.initWorkers();
  }

  private initWorkers() {
    this.workers = [];
    for (let i = 0; i < this.numWorkers; i += 1) {
      this.workers.push(
        new Worker(new URL('../workers/ray-tracing.worker', import.meta.url), {
          type: 'module',
        }),
      );
    }
  }

  terminateWorkers() {
    this.workers.forEach((worker) => {
      worker.terminate();
    });
  }

  processData(jobs: RayTracingWorkerDataInterface[]): Observable<any> {
    this.terminateWorkers();
    this.initWorkers();
    let completedJobs = 0;
    const results = new Subject<any>();
    this.workers.forEach((worker) => {
      worker.onmessage = (result) => {
        completedJobs += 1;
        results.next(result);
        // TODO: terminating workers prevents completion of observable
        if (completedJobs === jobs.length) {
          results.complete();
        }
      };
    });

    for (let i = 0; i < jobs.length; i += 1) {
      this.workers[i % this.numWorkers].postMessage(jobs[i]);
    }

    return results.asObservable();
  }
}
