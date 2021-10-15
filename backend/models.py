import logging

from tortoise import models, fields, Tortoise
from tortoise.contrib.pydantic import pydantic_model_creator

logger = logging.getLogger("xmm-bench.models")


# Renamed tables to avoid conflicts with Token from main.py (from User to UserTable)


class UserTable(models.Model):
    id_user = fields.IntField(pk=True)
    username_user = fields.CharField(max_length=50, null=False, unique=True)


class TokenTable(models.Model):
    id_token = fields.IntField(pk=True)
    creation_date_token = fields.DatetimeField(max_length=50, auto_now_add=True, null=False)
    duration_token = fields.IntField(max_length=5, null=True)
    id_user = fields.ForeignKeyField("models.UserTable", related_name="token_user")


# TODO Maybe add a Queue table to add persistence to the Queue

# create Pydantic models

Tortoise.init_models([__name__], "models")

UserTable_Pydantic = pydantic_model_creator(UserTable, name="UserTable")
UserTableIn_Pydantic = pydantic_model_creator(UserTable, name="UserTableIn", exclude_readonly=True)

TokenTable_pydantic = pydantic_model_creator(TokenTable, name="TokenTable")
TokenTableIn_Pydantic = pydantic_model_creator(TokenTable, name="TokenTableIn", exclude_readonly=True)
