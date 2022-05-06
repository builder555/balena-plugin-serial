import { SerialPort } from 'serialport';

class SerialPlugin {
    serialport: SerialPort | null = null;
    port: string;
    baud: number;
    packets: Buffer;

    constructor( { port, baud } : { port: string, baud: number}) {
        this.port = port;
        this.baud = baud;
        this.packets = Buffer.from('');
        this.serialport = new SerialPort({ path: this.port, baudRate: this.baud });
        this.serialport?.on('data', (data: Buffer) => {
            this.packets = Buffer.concat([this.packets, data]);
        });
    }

    async write(data: Buffer) {
        await this.serialport?.write(data);
    }

    read() {
        const data = this.packets;
        this.packets = Buffer.from('');
        return data;
    }
}

export default SerialPlugin;
