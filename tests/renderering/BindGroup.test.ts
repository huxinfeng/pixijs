import { BindGroup } from '../../src/rendering/renderers/gpu/shader/BindGroup';
import { Buffer } from '../../src/rendering/renderers/shared/buffer/Buffer';
import { BufferResource } from '../../src/rendering/renderers/shared/buffer/BufferResource';
import { BufferUsage } from '../../src/rendering/renderers/shared/buffer/const';

describe('BindGroup', () =>
{
    it('should init correctly', () =>
    {
        const buffer = new Buffer({
            data: new Float32Array(100),
            usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
        });

        expect(buffer.descriptor.size).toBe(400);
    });

    it('should let a bufferResource know if it has changed correctly', () =>
    {
        const buffer = new Buffer({
            data: new Float32Array(100),
            usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
        });

        const bufferResource = new BufferResource({
            buffer,
            offset: 100,
            size: 200
        });

        const bufferResourceId = bufferResource.resourceId;

        buffer.data = new Float32Array(200);

        expect(bufferResourceId).not.toBe(bufferResource.resourceId);
    });

    it('should not update resourceID if its the same size buffer', () =>
    {
        const buffer = new Buffer({
            data: new Float32Array(100),
            usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
        });

        const bufferId = buffer.resourceId;

        const updateListener = jest.fn();
        const changeListener = jest.fn();

        buffer.on('update', updateListener);
        buffer.on('change', changeListener);

        buffer.data = new Float32Array(100);

        expect(bufferId).toBe(buffer.resourceId);

        expect(updateListener).toBeCalledTimes(1);
        expect(changeListener).toBeCalledTimes(0);

        buffer.data = new Float32Array(50);

        expect(bufferId).not.toBe(buffer.resourceId);

        expect(updateListener).toBeCalledTimes(1);
        expect(changeListener).toBeCalledTimes(1);
    });

    it('should let a BindGroup know if buffer has changed correctly', () =>
    {
        const buffer = new Buffer({
            data: new Float32Array(100),
            usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
        });

        const bindGroup = new BindGroup({
            0: buffer,
        });

        const bindGroupKey = bindGroup.key;

        buffer.data = new Float32Array(200);

        expect(bindGroupKey).not.toBe(bindGroup.key);
    });

    it('should let a BindGroup know if bufferResource has changed correctly', () =>
    {
        const buffer = new Buffer({
            data: new Float32Array(100),
            usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
        });

        const bufferResource = new BufferResource({
            buffer,
            offset: 100,
            size: 200
        });

        const bindGroup = new BindGroup({
            0: bufferResource,
        });

        const bindGroupKey = bindGroup.key;

        buffer.data = new Float32Array(200);

        expect(bindGroupKey).not.toBe(bindGroup.key);
    });
});
