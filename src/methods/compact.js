/**
 * Compacts this ByteBuffer to be backed by a {@link ByteBuffer#buffer} of its contents' length. Contents are the bytes
 *  between {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. Will set `offset = 0` and `limit = capacity` and
 *  adapt {@link ByteBuffer#markedOffset} to the same relative position if set.
 * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
 * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
 * @returns {!ByteBuffer} this
 * @expose
 */
ByteBufferPrototype.compact = function(begin, end) {
    if (typeof begin === 'undefined') begin = this.offset;
    if (typeof end === 'undefined') end = this.limit;
    if (!this.noAssert) {
        //? ASSERT_RANGE();
    }
    if (begin === 0 && end === /*?= CAPACITY */)
        return this; // Already compacted
    var len = end - begin;
    //? if (NODE) {
    var buffer = new Buffer(/*?= CAPACITY */);
    this.buffer.copy(buffer, 0, begin, end);
    this.buffer = buffer;
    //? } else if (DATAVIEW) {
    var buffer = new ArrayBuffer(len);
    new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(begin, end));
    this.buffer = buffer;
    this.view = new DataView(buffer);
    //? } else {
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    view.set(this.view.subarray(begin, end));
    this.buffer = buffer;
    this.view = view;
    //? }
    if (this.markedOffset >= 0) this.markedOffset -= begin;
    this.offset = len;
    this.limit = /*?= CAPACITY */;
    return this;
};

