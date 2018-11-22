import { EventEmitter } from 'events';
import { ITransport, ITransportChild } from '@testring/types';


export class TransportMock extends EventEmitter implements ITransport {


    private processes: Map<string, ITransportChild> = new Map();

    public getProcessStdioConfig() {
        return [];
    }

    public getProcessesList() {
        return [];
    }

    public broadcast<T = any>(messageType: string, payload: T) {
        this.emit(messageType, payload);
    }

    public broadcastFrom<T = any>(messageType: string, payload: T, processID: string) {
        this.emit(messageType, payload, processID);
    }

    public broadcastLocal<T = any>(messageType: string, payload: T) {
        this.emit(messageType, payload);
    }

    public send<T = any>(src: string, messageType: string, payload: T): Promise<void> {
        this.emit(messageType, payload);

        return Promise.resolve();
    }

    public on<T = any>(messageType: string, callback: (m: T, source?: string) => void): any {
        super.on(messageType, callback);

        return () => this.removeListener(messageType, callback);
    }

    public once<T = any>(messageType: string, callback: (m: T, source?: string) => void): any {
        super.on(messageType, callback);

        return () => this.removeListener(messageType, callback);
    }

    public onceFrom<T = any>(processID: string, messageType: string, callback: (m: T, source?: string) => void): any {
        const handler = (message, source) => {
            if (processID === source) {
                callback(message);
                this.removeListener(messageType, handler);
            }
        };

        super.on(messageType, handler);

        return () => this.removeListener(messageType, handler);
    }

    public registerChild(processID: string, process: ITransportChild) {
        this.processes.set(processID, process);
    }
}
