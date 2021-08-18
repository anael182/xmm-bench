from pydantic import BaseModel


class Response(BaseModel):
    message: str
    statut : bool
    #is_offer: Optional[bool] = None