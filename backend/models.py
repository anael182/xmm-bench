import logging

from tortoise import models, fields, Tortoise
from tortoise.contrib.pydantic import pydantic_model_creator

logger = logging.getLogger("xmm-bench.models")


class UserDB(models.Model):
    id_user = fields.IntField(pk=True)
    username_user = fields.CharField(max_length=50, nullable=False, unique=True)


class TokenDB(models.Model):
    id_token = fields.IntField(pk=True)
    creation_date_token = fields.DatetimeField(max_length=50, auto_now_add=True, nullable=False)
    duration_token = fields.IntField(max_length=5, nullable=True)
    id_user = fields.ForeignKeyField("models.UserDB", related_name="token_user")


# create Pydantic models

Tortoise.init_models([__name__], "models")

UserDB_Pydantic = pydantic_model_creator(UserDB, name="UserDB")
UserDBIn_Pydantic = pydantic_model_creator(UserDB, name="UserDBIn", exclude_readonly=True)

TokenDB_pydantic = pydantic_model_creator(TokenDB, name="TokenDB")
TokenInDB_Pydantic = pydantic_model_creator(TokenDB, name="TokenDBIn", exclude_readonly=True)
