Stateless Quorum Based on Shamir's Secret Sharing
=================================================

This project is an *experimental* proof-of-concept! It implements
a state-less quorum system based on [Shamir's Secret Sharing
Scheme](https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing). It
allows to collect arbitrary data (in the form of strings of characters)
from clients while only allowing a backend to decrypt data having been
sent by enough users.

It works in the following way:
1. Whenever a client wants to send a value, it creates multiple shares using
   SSSS
2. It picks one share randomly and sends it to the backend

The shares are created in such a way that at least K clients need to send a
share derived from the same secret for the backend to be able to decrypt it.

## Getting Started

Build project and run server:
```sh
$ npm install
$ npm pack
$ node ./dist/server.cjs.js
```

Then use `example.js` to send encrypted version to server and see what happens:
```sh
$ ./example.js foo
# Server displays:
# > New value 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae
$ ./example.js foo
$ ./example.js foo
$ ./example.js foo
# Server displays:
# > Combine 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae foo
```

The first message displayed by `server.cjs.js` means that a new value
was received (the sha256 hash was never seen before; in practice we do
not need to keep track of hashes in memory and collecting the data is
enough).

The second message means that the server received enough shares to be
able to decrypt the original value by combining the shares.

A possible setup would be to create a collector endpoint (e.g.: an
AWS lambda), which would accept shares from clients and store them on
`S3`. There is no need to keep any state in memory at this stage (i.e.:
*stateless*).

Whenever the data needs to be accessed or analyzed, it is enough to
load the shares from S3, group them by `hash` and then try to combine
per-hash. If enough shares were received for a given hash, then we can
access the original secret, otherwise it stays protected and cannot be
accessed.

## Drawbacks

1. This works for secrets which are truly secrets (and cannot be guess
or brute-forced). For example private URLs might be good candidates, but
very short passwords are not.
2. The amount of data collected is higher than with an interactive
quorum server (where we would need to keep a count of number of clients
reporting each hash);
  -  We will collect secrets even if they will never be decryptable
  (i.e.: not enough shares are received), which is fine since the data
  cannot be accessed, but it uses storage.
  - The size of the shares will always take more space than the original
  secret, and multiple shares need to be stored for each secret (which increases
  the total amount of data).

There are ways we could improve. For example, we could run a job every
night to decrypt the shares which are safe, and discard old hashes for
which we do not expect to receive new shares anymore; this would improve
the storage situation.
