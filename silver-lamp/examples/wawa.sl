a = 0xff
f = 20

# while f != 0
tag loop
jumpz f end

a = a - f

# f--
d = 1
f = f-d
jump loop

tag end
# a == 200