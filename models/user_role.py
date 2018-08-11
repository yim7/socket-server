import json
from enum import (
    Enum,
    auto,
)


class UserRole(Enum):
    guest = auto()
    normal = auto()


class EnumEncoder(json.JSONEncoder):
    prefix = "__enum__"

    def default(self, o):
        if isinstance(o, UserRole):
            return {self.prefix: o.name}
        else:
            return super().default(o)


def enum_decode(d):
    if EnumEncoder.prefix in d:
        name = d[EnumEncoder.prefix]
        return UserRole[name]
    else:
        return d
