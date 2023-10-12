# 12 is the max before overflow
f = 12 # terms

# default value, saves 2 instruction by omitting it
# a = 0 #n1
b = 1 #n2

tag loop
# while(f > 0)
# while(f !== 0){
jumpz f end

# nth = n1+n2
d = a + b
# n1 = n2
a = b
# n2 = nth
b = d

# f--
d = 1
f = f-d
jump loop

tag end
jump end