CC      = gcc
CFLAGS  = -Wall -Wextra -g
SRC_DIR = src
SRCS    = $(SRC_DIR)/main.c \
          $(SRC_DIR)/priority.c \
          $(SRC_DIR)/srtf.c \
          $(SRC_DIR)/metrics.c \
          $(SRC_DIR)/validation.c
TARGET  = simulator

all: $(TARGET)

$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) -I$(SRC_DIR) $(SRCS) -o $(TARGET)

clean:
	rm -f $(TARGET)

run: all
	./$(TARGET)