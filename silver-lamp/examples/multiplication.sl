a = 5
b = 3

# copy original data to avoid modifying b
d = b

# while d != 0
tag loop
jumpz d end

# c += a
c = c + a

# d--
e = 1
d = d-e
jump loop

tag end
# this basically makes c = a + a + a
# c == 15