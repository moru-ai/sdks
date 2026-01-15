from enum import Enum


class SandboxRunEndReason(str, Enum):
    ERROR = "error"
    KILLED = "killed"
    SHUTDOWN = "shutdown"
    TIMEOUT = "timeout"

    def __str__(self) -> str:
        return str(self.value)
