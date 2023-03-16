# INSTRUCTIONS
| IMPLEMENTATION | CODE | OP | Inputs (Registers) | Outputs (Registers) | Description |
|---|---|---|---|---|---|
| ✅ | `0x00` | NOP | `[]` | `[]` | No Operation |
| ✅ | `0x01` | ADD | `[A, B]` | `[A:((A + B) % 256)]` | Performs an addition on `A` and `B`, returns `A + B` |
| ✅ | `0x02` | SUB | `[A, B]` | `[A:((A - B) % 256)]` | Performs a substraction of `A` by `B`, returns `A - B` |
| ❌ | `0x03` | MUL | `[A, B]` | `[A:((A * B) % 256)]` | Performs a multiplication on `A` and `B`, returns `A * B` |
| ❌ | `0x04` | DIV | `[A, B]` | `[A:(A / B)]` | Performs a division on `A` by `B`, returns `A / B` |
| ✅ | `0x10` | LTEQ | `[A, B]` | `[A:(A <= B)]` | Returns `0xFF` if `A` is less than or equal to `B`, `0` otherwise `0x00` |
| ✅ | `0x11` | GTEQ | `[A, B]` | `[A:(A >= B)]` | Returns `0xFF` if `A` is greater than or equal to `B`, `0` otherwise `0x00` |
| ✅ | `0x12` | LT | `[A, B]` | `[A:(A < B)]` | Returns `0xFF` if `A` is greater than `B`, `0` otherwise `0x00` |
| ✅ | `0x13` | GT | `[A, B]` | `[A:(A > B)]` | Returns `0xFF` if `A` is less than `B`, `0` otherwise `0x00` |
| ✅ | `0x14` | EQ | `[A, B]` | `[A:(A == B)]` | Returns `0xFF` if `A` is equal to `B`, `0` otherwise `0x00` |
| ✅ | `0x20` | AND | `[A, B]` | `[A:(A & B)]` | bitwise AND operation |
| ✅ | `0x21` | OR | `[A, B]` | `[A:(A \| B)]` | bitwise OR operation |
| ✅ | `0x22` | XOR | `[A, B]` | `[A:(A ^ B)]` | bitwise XOR operation,  |
| ✅ | `0x23` | NOT | `[A]` | `[A:(~A)]` | bitwise NOT operation |
| ✅ | `0x30` | PC | `[]` | `[B:pc[0:8], C:pc[8:16]]` | Returns the positional counter |
| ✅ | `0x31` | CARRY | `[]` | `[A:carry]` | Returns `0xFF` if the last arithmetic operation had a carry, otherwise `0x00` |
| ✅ | `0x40` | JUMP | `[B:dest[0:8], C:dest[8:16]]` | `[]` | Jumps to `dest` |
| ✅ | `0x41` | JUMPI | `[A:condition, B:dest[0:8], C:dest[8:16]]` | `[]` | Jumps to `dest` if `condition` is equal to `0xFF` |
| ✅ | `0x42` | JUMPZ | `[A:condition, B:dest[0:8], C:dest[8:16]]` | `[]` | Jumps to `dest` if `condition` is equal to `0x00` |
| ❌ | `0x50` | RI | `[B:port]` | `[A:data]` | Read from the I/O port `port` |
| ❌ | `0x51` | WI | `[A:data, B:port]` | `[]` | Write byte `data` to the I/O port `port` |
| ✅ | `0x60` | LDA | `[]` | `[A:data]` | Set register `A` to the next byte of the rom; next op will be interpreted as `NOP` |
| ✅ | `0x61` | LDB | `[]` | `[B:data]` | Set register `B` to the next byte of the rom; next op will be interpreted as `NOP` |
| ✅ | `0x62` | LDC | `[]` | `[C:data]` | Set register `C` to the next byte of the rom; next op will be interpreted as `NOP` |
| ❌ | `0x70` | SWAPAB | `[A:data1, B:data2]` | `[A:data2, B:data1]` | Swap registers `A` and `B` |
| ❌ | `0x71` | SWAPAC | `[A:data1, C:data2]` | `[A:data2, C:data1]` | Swap registers `A` and `C` |
| ❌ | `0x72` | SWAPBC | `[B:data1, C:data2]` | `[B:data2, C:data1]` | Swap registers `B` and `C` |
| ❌ | `0x80` | COPYAB | `[A:data]` | `[A:data, B:data]` | Copy register `A` to register `B` |
| ❌ | `0x81` | COPYAC | `[A:data]` | `[A:data, C:data]` | Copy register `A` to register `C` |
| ❌ | `0x81` | COPYBC | `[B:data]` | `[B:data, C:data]` | Copy register `B` to register `C` |
| ❌ | `0x90` | MSET | `[A:data, B:dest[0:8], C:dest[8:16]]` | `[]` | Write to the memory `data` at position `dest`. |
| ❌ | `0x91` | MLOAD | `[B:dest[0:8], C:dest[8:16]]` | `[A:data]` | Read the memory at position `dest` |
| ❌ | `0x92` | MCOPY | `[B:dest[0:8], C:dest[8:16]]` | `[A:mem.get(dest)]` | Copy 1 byte of memory at `dest` into the register `A`. |

# REGISTERS
## A
Primary data storage slot

## B
Secondary data storage slot, also used for the 8 most significant bits of an address

## C
Used for the 8 least significant bits of an address.

## Flags
Used for flags, here is a representation of the register structure:
| Bit | Name | Usage | Related Instructions |
|---|---|---|---|
| 0 | Carry | Set by an arithmetic operation, tells if the last operation had an overflow or underflow. Can be retrieved using the `CARRY` instruction | `ADD`, `SUB`, `CARRY` |
| 1 | Skip Increment | This bit is used by the `JUMP`, `JUMPI` and `JUMPZ` instructions. When this bit is 1, the counter will not increment for the next instruction. This is only used in the context of jumps, when the jump occurs before the increment. Setting this bit stops the next increment. | `JUMP`, `JUMPI`, `JUMPZ` |

# Ticks
| Tick | Name | Usage |
|---|---|---|
| 0 | Fetch | Nothing should actually run on this tick, it is used to load the instruction from the rom |
| 1 | Fetch | This tick sets the content of the rom (the instruction) to a separate register |
| 2 | Execute | The instruction should execute here |
| 3 | Execute | The instruction should execute here |
# MEMORY
> currently in progress