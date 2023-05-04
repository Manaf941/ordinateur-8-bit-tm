```md
# Instruction structure
0 0 0 0 0 _ dst0 dst1 dst2
0 0 _ lsrc0 lsrc1 lsrc2 _ rsrc0 rsrc1 rsrc2
```
# INSTRUCTIONS
| IMPLEMENTATION | CODE | OP | Inputs (Registers) | Outputs (Registers) | Description |
|---|---|---|---|---|---|
| ✅ | `0b0000_0000` | NOP | `[]` | `[]` | No Operation |
| ✅ | `0b1000_0xxx` | ADD | `[A, B]` | `[A:((A + B) % 256)]` | Performs an addition on `A` and `B`, returns `A + B` |
| ✅ | `0b1000_1xxx` | SUB | `[A, B]` | `[A:((A - B) % 256)]` | Performs a substraction of `A` by `B`, returns `A - B` |
| ✅ | `0b1001_0xxx` | LTEQ | `[A, B]` | `[A:(A <= B)]` | Returns `0xFF` if `A` is less than or equal to `B`, `0` otherwise `0x00` |
| ✅ | `0b1001_1xxx` | GTEQ | `[A, B]` | `[A:(A >= B)]` | Returns `0xFF` if `A` is greater than or equal to `B`, `0` otherwise `0x00` |
| ✅ | `0b1010_0xxx` | LT | `[A, B]` | `[A:(A < B)]` | Returns `0xFF` if `A` is greater than `B`, `0` otherwise `0x00` |
| ✅ | `0b1010_1xxx` | GT | `[A, B]` | `[A:(A > B)]` | Returns `0xFF` if `A` is less than `B`, `0` otherwise `0x00` |
| ✅ | `0b1011_0xxx` | EQ | `[A, B]` | `[A:(A == B)]` | Returns `0xFF` if `A` is equal to `B`, `0` otherwise `0x00` |
| ✅ | `0b1011_1xxx` | AND | `[A, B]` | `[A:(A & B)]` | bitwise AND operation |
| ✅ | `0b1100_0xxx` | OR | `[A, B]` | `[A:(A \| B)]` | bitwise OR operation |
| ✅ | `0b1100_1xxx` | XOR | `[A, B]` | `[A:(A ^ B)]` | bitwise XOR operation,  |
| ✅ | `0b1101_0xxx` | NOT | `[A]` | `[A:(~A)]` | bitwise NOT operation |
| ✅ | `0b1101_1xxx` | LDX | `[]` | `[A:data]` | Set register `A` to the next byte of the rom; |
| ❌ | `0b1110_0xxx` | RI | `[B:port]` | `[A:data]` | Read from the I/O port `port` |
| ✅ | `0b1110_1xxx` | CARRY | `[]` | `[A:carry]` | Returns `0xFF` if the last arithmetic operation had a carry, otherwise `0x00` |
| ❌ | `0x00` | WI | `[A:data, B:port]` | `[]` | Write byte `data` to the I/O port `port` |
| ✅ | `0b0001_0xxx` | PC | `[]` | `[C:pc[0:8], D:pc[8:16]]` | Returns the positional counter |
| ✅ | `0b0010_0xxx` | JUMP | `[C:dest[0:8], D:dest[8:16]]` | `[]` | Jumps to `dest` |
| ✅ | `0b0010_1xxx` | JUMPI | `[A:condition, C:dest[0:8], D:dest[8:16]]` | `[]` | Jumps to `dest` if `condition` is equal to `0xFF` |
| ✅ | `0b0011_0xxx` | JUMPZ | `[A:condition, C:dest[0:8], D:dest[8:16]]` | `[]` | Jumps to `dest` if `condition` is equal to `0x00` |
| ✅ | `0b0100_0xxx` | MSET | `[A:data, C:dest[0:8], D:dest[8:16]]` | `[]` | Write to the memory `data` at position `dest`. |
| ✅ | `0b0100_1xxx` | MLOAD | `[C:dest[0:8], D:dest[8:16]]` | `[A:data]` | Read the memory at position `dest` |

# REGISTERS
## A
Primary data storage slot

## B
Secondary data storage slot

## C
Used for the 8 most significant bits of an address.

## D
Used for the 8 least significant bits of an address.

## Flags
Used for flags, here is a representation of the register structure:
| Bit | Name | Usage | Related Instructions |
|---|---|---|---|
| 0 | Carry | Set by an arithmetic operation, tells if the last operation had an overflow or underflow. Can be retrieved using the `CARRY` instruction | `ADD`, `SUB`, `CARRY` |
| 1 | Skip Increment | This bit is used by the `JUMP`, `JUMPI` and `JUMPZ` instructions. When this bit is 1, the counter will not increment for the next instruction. This is only used in the context of jumps, when the jump occurs before the increment. Setting this bit stops the next increment. | `JUMP`, `JUMPI`, `JUMPZ` |
| 2 | Boolean Result | (TODO) This bit is usually the answer from a comparaison operator, such as LT, LTEQ, GT, GTEQ, EQ | `LT`, `LTEQ`, `GT`, `GTEQ`, `EQ` |

# Ticks
| Tick | Name | Usage |
|---|---|---|
| 0 | Fetch | Nothing should actually run on this tick, it is used to load the instruction from the rom |
| 1 | Fetch | This tick sets the content of the rom (the instruction) to a separate register |
| 2 | Execute | The instruction should execute here |
| 3 | Execute | The instruction should execute here |

# MEMORY
TODO