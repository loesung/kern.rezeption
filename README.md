Reception Server
================

This is the reception server of the kernel system. It is a server, listening
on 443 or 80 port, and provides API or user interface to the application
system.

## Introduction
The kernel system, runs on a fully trusted hardware, provides following
services:

1. Receive user's input, in order to:
    1. encrypt it, and provide it to the application system.
    2. adjust necessary configurations within the kernel system.
2. Receive messages from the application system, in order to:
    1. decrypt it, and display it to the user.

The tasks of this kernel system is in fact the management and usage of
codebooks, which are exchanged between different entities. This reception
server's task, is providing APIs to handle these different types of requests
and route them to the other parts of the whole system.

## Implementation
This server is implemented with NodeJS, considering its flexibility. This
server should run on a tiny hardware with Linux operating system, maybe
a Raspberry Pi.
