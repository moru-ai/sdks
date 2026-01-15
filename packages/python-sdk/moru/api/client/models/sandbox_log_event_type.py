from enum import Enum


class SandboxLogEventType(str, Enum):
    PROCESS_END = "process_end"
    PROCESS_START = "process_start"
    STDERR = "stderr"
    STDOUT = "stdout"

    def __str__(self) -> str:
        return str(self.value)
