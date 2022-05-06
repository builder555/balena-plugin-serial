process.env.NODE_ENV = 'test';
import SerialPlugin from './index';

const fakeSerialWrite =  jest.fn();
let eventEmitter: any;

jest.mock('serialport', () => {
    const EventEmitter = require('events');
    class MockSerialPort extends EventEmitter {
        constructor(args: any){
            super();
            eventEmitter = this;
        }
        write = fakeSerialWrite
    }
    return {SerialPort: MockSerialPort};
});

const simulateDataOnPort = (data: Buffer) => {
    eventEmitter.emit('data', data);
}

describe('Serial Communication Plugin', () => {
    it('sends data to the serial port', async () =>{
        const fakeData = Buffer.from('1');
        const plugin = new SerialPlugin( { port: '/dev/serial0', baud: 9600 } );
        await plugin.write(fakeData);
        expect(fakeSerialWrite).toBeCalledWith(fakeData);
    });
    it('reads data from the serial port', () => {
        const fakeData = Buffer.from('1');
        const plugin = new SerialPlugin( { port: '/dev/serial0', baud: 9600 } );
        simulateDataOnPort(fakeData);
        const data = plugin.read();
        expect(data).toEqual(fakeData);
    })
});
