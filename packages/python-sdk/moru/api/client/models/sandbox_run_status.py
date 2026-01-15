from enum import Enum


class SandboxRunStatus(str, Enum):
    PAUSED = "paused"
    RUNNING = "running"
    STOPPED = "stopped"

    def __str__(self) -> str:
        return str(self.value)
