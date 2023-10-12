# test writing at 0x0000
a = 12
mwrite a
mread b
nop # let the script see the values

# test writing at another address
h = 0
l = 1
mwrite a
nop