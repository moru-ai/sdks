import datetime
from collections.abc import Mapping
from typing import Any, TypeVar, Union

from attrs import define as _attrs_define
from attrs import field as _attrs_field
from dateutil.parser import isoparse

from ..models.sandbox_run_end_reason import SandboxRunEndReason
from ..models.sandbox_run_status import SandboxRunStatus
from ..types import UNSET, Unset

T = TypeVar("T", bound="SandboxRun")


@_attrs_define
class SandboxRun:
    """
    Attributes:
        created_at (datetime.datetime): When the sandbox was created
        sandbox_id (str): Unique sandbox identifier
        status (SandboxRunStatus): Status of a sandbox run
        template_id (str): Template used to create the sandbox
        alias (Union[Unset, str]): Template alias
        end_reason (Union[Unset, SandboxRunEndReason]): Reason the sandbox stopped
        ended_at (Union[Unset, datetime.datetime]): When the sandbox stopped
    """

    created_at: datetime.datetime
    sandbox_id: str
    status: SandboxRunStatus
    template_id: str
    alias: Union[Unset, str] = UNSET
    end_reason: Union[Unset, SandboxRunEndReason] = UNSET
    ended_at: Union[Unset, datetime.datetime] = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_at = self.created_at.isoformat()

        sandbox_id = self.sandbox_id

        status = self.status.value

        template_id = self.template_id

        alias = self.alias

        end_reason: Union[Unset, str] = UNSET
        if not isinstance(self.end_reason, Unset):
            end_reason = self.end_reason.value

        ended_at: Union[Unset, str] = UNSET
        if not isinstance(self.ended_at, Unset):
            ended_at = self.ended_at.isoformat()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "createdAt": created_at,
                "sandboxID": sandbox_id,
                "status": status,
                "templateID": template_id,
            }
        )
        if alias is not UNSET:
            field_dict["alias"] = alias
        if end_reason is not UNSET:
            field_dict["endReason"] = end_reason
        if ended_at is not UNSET:
            field_dict["endedAt"] = ended_at

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        created_at = isoparse(d.pop("createdAt"))

        sandbox_id = d.pop("sandboxID")

        status = SandboxRunStatus(d.pop("status"))

        template_id = d.pop("templateID")

        alias = d.pop("alias", UNSET)

        _end_reason = d.pop("endReason", UNSET)
        end_reason: Union[Unset, SandboxRunEndReason]
        if isinstance(_end_reason, Unset):
            end_reason = UNSET
        else:
            end_reason = SandboxRunEndReason(_end_reason)

        _ended_at = d.pop("endedAt", UNSET)
        ended_at: Union[Unset, datetime.datetime]
        if isinstance(_ended_at, Unset):
            ended_at = UNSET
        else:
            ended_at = isoparse(_ended_at)

        sandbox_run = cls(
            created_at=created_at,
            sandbox_id=sandbox_id,
            status=status,
            template_id=template_id,
            alias=alias,
            end_reason=end_reason,
            ended_at=ended_at,
        )

        sandbox_run.additional_properties = d
        return sandbox_run

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
