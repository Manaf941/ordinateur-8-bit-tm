# Instruction structure
```md
0 0 0 0 0 _ dst0 dst1 dst2
0 0 _ lsrc0 lsrc1 lsrc2 _ rsrc0 rsrc1 rsrc2
```
# INSTRUCTIONS
| IMPLEMENTATION | N bytes | CODE | OP | Inputs (Registers) | Outputs (Registers) | Description |
|---|---|---|---|---|---|---|
| ✅ | 1 | `0b0000_0000` | NOP | `[]` | `[]` | `ø` |
| ✅ | 2 | `0b1000_0xxx` | ADD | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc + rsrc` |
| ✅ | 2 | `0b1000_1xxx` | SUB | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc - rsrc` |
| ✅ | 2 | `0b1001_0xxx` | LTEQ | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc <= rsrc` |
| ✅ | 2 | `0b1001_1xxx` | GTEQ | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc >= rsrc` |
| ✅ | 2 | `0b1010_0xxx` | LT | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc < rsrc` |
| ✅ | 2 | `0b1010_1xxx` | GT | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc > rsrc` |
| ✅ | 2 | `0b1011_0xxx` | EQ | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc == rsrc` |
| ✅ | 2 | `0b1011_1xxx` | AND | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc & rsrc` |
| ✅ | 2 | `0b1100_0xxx` | OR | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc \| rsrc` |
| ✅ | 2 | `0b1100_1xxx` | XOR | `[lsrc, rsrc]` | `[dst]` | `dst = lsrc ^ rsrc` |
| ✅ | 2 | `0b1101_0xxx` | NOT | `[lsrc]` | `[dst]` | `dst = ~lsrc` |
| ✅ | 2 | `0b1101_1xxx` | LDX | `[]` | `[dst]` | `dst = next byte` |
| ❌ | 2 | `0b1110_0xxx` | RI | `[lsrc]` | `[dst]` | `dst = IO[lsrc]` |
| ✅ | 2 | `0b1110_1xxx` | CARRY | `[]` | `[dst]` | `dst = carry` |
| ❌ | 2 | `0b1111_0xxx` | WI | `[lsrc, rsrc]` | `[]` | `IO[lsrc] = rsrc` |
| ✅ | 2 | `0b1111_1xxx` | COPY | `[lsrc]` | `[dst]` | `dst = lsrc` |
| ✅ | 1 | `0b0010_0xxx` | JUMP | `[]` | `[]` | `pc = HL` |
| ✅ | 1 | `0b0010_1xxx` | JUMPI | `[dst]` | `[]` | `pc = HL if dst == 0xFF` |
| ✅ | 1 | `0b0011_0xxx` | JUMPZ | `[dst]` | `[]` | `pc = HL if dst == 0x00` |
| ✅ | 1 | `0b0011_1xxx` | JUMPC | `[]` | `[]` | `pc = HL if carry == 1` |
| ✅ | 1 | `0b0100_0xxx` | MWRITE | `[dst]` | `[]` | `ram[HL] = lsrc` |
| ✅ | 1 | `0b0100_1xxx` | MREAD | `[]` | `[dst]` | `dst = ram[HL]` |
| 
# REGISTERS
## A-F
Free data slots; Up to the programmer to use them as they wish.
## HL
Used as a pointer to the ram/rom. H means high, L means low. The HL register is 16 bits long, so it can point to 64kb of memory.
## PC
Program counter, points to the current instruction being executed. The PC register is 16 bits long, so it can point to 64kb of memory.

## Flags
Used for flags, here is a representation of the register structure:
| Bit | Name | Usage | Related Instructions |
|---|---|---|---|
| 0 | Carry | Set by an arithmetic operation, tells if the last operation had an overflow or underflow. Can be retrieved using the `CARRY` instruction | `ADD`, `SUB`, `CARRY` |

# Ticks
Instructions run on 6 ticks, here is a representation of the tick structure:
| Tick | Name | Usage |
|---|---|---|
| 0 | Fetch | Nothing should actually run on this tick, it is used to load the instruction from the rom |
| 1 | Fetch | This tick sets the content of the rom (the instruction) to a separate register |
| 2 | Execute | The instruction should execute here |
| 3 | Execute | The instruction should execute here |
| 4 | Execute | The instruction should execute here |
| 5 | Execute | The instruction should execute here |

# MEMORY
No special layout for now. If I develop a higher level programming language for this computer, I might add a more structured layout.