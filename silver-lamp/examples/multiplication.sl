c = 5
d = 3

# while d != 0                                                                      
tag loop
jumpz d loop

a = a + c

# d--
e = 1
d = d-e
jump loop

tag end
# a == 15