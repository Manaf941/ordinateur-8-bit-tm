# value
f = 0x15
# increment
e = 1
a = 0
b = 0

tag loop
h = a
l = b
mwrite f
b = b + e
jumpc carry
jump loop

tag carry
a = a + e
jump loop

tag end