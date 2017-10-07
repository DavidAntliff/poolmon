import smbus
import time

bus = smbus.SMBus(1)     # Bus 1

# ADDR Sel floating
address = 0x39

command = 0x80

# Write control register 0x00 via command register 0x80: power on mode (0x03)
bus.write_byte_data(address, 0x00 | command, 0x03)

# Write timing register 0x01 via command register 0x80: nominal integration time=402 ms (0x02)
bus.write_byte_data(0x39, 0x01 | command, 0x02)

while True:
    # wait 0.5 seconds
    time.sleep(0.5)

    # Read DATA0LOW (0x0c) and DATA0HIGH (0x0d): ch0 LSB, ch0 MSB (two bytes)
    data0 = bus.read_i2c_block_data(0x39, 0x0c | command, 2)

    # Read DATA1LOW (0x0e) and DATA1HIGH (0x0f): ch1 LSB, ch1 MSB (two bytes)
    data1 = bus.read_i2c_block_data(0x39, 0x0e | command, 2)

    ch0 = data0[1] * 256 + data0[0]
    ch1 = data1[1] * 256 + data1[0]

    print("Full spectrum: %d" % (ch0,))
    print("Infrared:      %d" % (ch1,))
    print("Visible:       %d" % (ch0 - ch1,))
    print("")
