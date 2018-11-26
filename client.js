import {
  init, setRNG, str2hex, share, construct,
} from './vendor/secrets';
import sha256 from './vendor/sha256';
import seedrandom from './vendor/seedrandom';

init(20);

export default function sharify(secret) {
  const h = sha256(secret);
  const rng = seedrandom(h);

  const randomInt = () => Math.floor(rng() * Number.MAX_SAFE_INTEGER);
  const randomByte = () => randomInt() % 255;
  const randomBytes = (size) => {
    const bytes = new Uint8Array(size);
    for (let i = 0; i < size; i += 1) {
      bytes[i] = randomByte();
    }
    return bytes;
  };

  setRNG((bits) => {
    const bytes = Math.ceil(bits / 8);
    const radix = 16;
    const size = 4;
    let str = null;
    while (str === null) {
      str = construct(bits, randomBytes(bytes), radix, size);
    }

    return str;
  });

  const hex = str2hex(secret);
  const shares = share(hex, 10, 3);

  return {
    h,
    s:
      shares[
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) % shares.length
      ],
  };
}
